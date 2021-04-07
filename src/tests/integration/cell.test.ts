import { createTestClient } from "apollo-server-testing";
import { ApolloServer, gql } from "apollo-server-express";
import { buildSchema } from "../../utils";
import mongoose from "mongoose";

import { resolvers } from "../../modules";
import { CellMongooseModel } from "../../modules/cell/model";


import {
  connect,
  clearDatabase,
  closeDatabase,
  populateDatabase,
} from "../utils";


beforeAll(async () => connect());

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
describe("Cell", () => {
  it(`should create a cell`, async () => {
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
      createCellData: {
        type: `Test type`,
      },
    };

    const CREATE_CELL = gql`
      mutation createCell($createCellData: CellInput!) {
        createCell(cellData: $createCellData) {
          type
        }
      }
    `;

    // run query against the server and snapshot the output
    const res = await mutate({
      mutation: CREATE_CELL,
      variables,
    });

    expect(res).toMatchSnapshot();
  });

  it(`should get a cell`, async () => {
    // We generate a cell ID
    const cellId = new mongoose.Types.ObjectId().toHexString().toString();

    // Add a cell with the generated ID in the database
    await populateDatabase(CellMongooseModel, [
      {
        _id: cellId,
        type: "a-type",
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
      id: cellId,
    };

    const GET_CELL = gql`
      query getCell($id: ObjectId!) {
        getCell(id: $id) {
          type
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
