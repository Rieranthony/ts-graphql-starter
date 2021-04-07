import { createTestClient } from "apollo-server-testing";
import { ApolloServer, gql } from "apollo-server-express";
import { buildSchema } from "../../utils";
import mongoose from "mongoose";

import { resolvers } from "../../modules";
import { CellMongooseModel } from "../../modules/cell/model";
import { CellCollectionMongooseModel } from "../../modules/cellCollection/model";


import {
  connect,
  clearDatabase,
  closeDatabase,
  populateDatabase,
} from "../utils";

// Set the cell Ids ahead of time for reference in other tests
const cellIds = [
  new mongoose.Types.ObjectId().toHexString().toString(),
  new mongoose.Types.ObjectId().toHexString().toString()
]

beforeAll(async () => connect());

// You can populate the DB before each test
beforeEach(async () => {

  await populateDatabase(CellMongooseModel, [
    {
      _id: cellIds[0],
      type: "t-type",
    },
    {
      _id: cellIds[1],
      type: "d-type",
    },
  ]);
});

afterEach(async () => {
  await clearDatabase();
});

afterAll(async (done) => {
  await closeDatabase();
  done();
});

/**
 * Prompt test suite.
 */
describe("Collection", () => {
  it(`should create a cell collection`, async () => {
    // We build the schema
    const graphQLSchema = await buildSchema();

    // We create the Apollo Server
    const server = new ApolloServer({
      schema: graphQLSchema,
    }) as any;

    // use the test server to create a query function
    const { mutate } = createTestClient(server);

    // We define the query and the variables as you would do from your front-end
    const variables = {
      collectionData: {
        name: "test collection",
        cells: cellIds,
      },
    };

    const CREATE_COLLECTION = gql`
      mutation createCollection($collectionData: CellCollectionInput!) {
        createCollection(collectionData: $collectionData) {
          name
          cells {
            type
          }
        }
      }
    `;

    // run query against the server and snapshot the output
    const res = await mutate({
      mutation: CREATE_COLLECTION,
      variables,
    });

    expect(res).toMatchSnapshot();
  });

  it(`should get a cell collection`, async () => {
    // We generate a collection ID
    const collectionId = new mongoose.Types.ObjectId().toHexString().toString();

    // Add a cell collection with the generated ID in the database
    await populateDatabase(CellCollectionMongooseModel, [
      {
        _id: collectionId,
        name: "another collection",
        cells: cellIds
      },
    ]);

    // We build the schema
    const graphQLSchema = await buildSchema();

    // We create the Apollo Server
    const server = new ApolloServer({
      schema: graphQLSchema,
    }) as any;

    // use the test server to create a query function
    const { query } = createTestClient(server);

    const variables = {
      id: collectionId,
    };

    const GET_CELL = gql`
      query getCollection($id: ObjectId!) {
        getCollection(id: $id) {
          name
          cells {
            type
          }
        }
      }
    `;

    // run query against the server and snapshot the output
    const res = await query({
      query: GET_CELL,
      variables,
    });

    expect(res).toMatchSnapshot();
  });
});


it(`should fail if a cell doesn't exist`, async () => {

    // We generate a fake cell ID
    const fakeId = new mongoose.Types.ObjectId().toHexString().toString();
    const cellIdsWithFake = cellIds.concat(fakeId)
    // We build the schema
    const graphQLSchema = await buildSchema();

    // We create the Apollo Server
    const server = new ApolloServer({
      schema: graphQLSchema,
    }) as any;

    // use the test server to create a query function
    const { mutate } = createTestClient(server);

    // We define the query and the variables as you would do from your front-end
    const variables = {
      collectionData: {
        name: "test collection",
        cells: cellIdsWithFake,
      },
    };

    const CREATE_COLLECTION = gql`
      mutation createCollection($collectionData: CellCollectionInput!) {
        createCollection(collectionData: $collectionData) {
          name
          cells {
            type
          }
        }
      }
    `;

    // run query against the server
    const res = await mutate({
      mutation: CREATE_COLLECTION,
      variables,
    });

    const expectedMessage = `Tried to create a collection with 1 nonexistent cell _id(s): ${fakeId}`
    expect(res.data).toBeNull();
    expect(res.errors).not.toBeNull();
    expect(res.errors!.length).toEqual(1);
    expect(res.errors![0].message).toEqual(expectedMessage)
});
