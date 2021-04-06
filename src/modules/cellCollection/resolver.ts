import { Resolver, Arg, Query, Mutation, ID } from "type-graphql";
import { Service } from "typedi";
import { ObjectId } from "mongodb";

import { CellCollection } from "../../entities";
import { CollectionInput } from "./input";
import CollectionService from "./service";


/*
  IMPORTANT: Your business logic must be in the service!
*/

@Service() // Dependencies injection
@Resolver((of) => CellCollection)
export default class CollectionResolver {
  constructor(private readonly collectonService: CollectionService) {}

  @Query((returns) => CellCollection)
  async getCollection(@Arg("id") id: ObjectId) {
    const collecton = await this.collectonService.getById(id);

    return collecton;
  }

  @Mutation((returns) => CellCollection)
  async createCollection(
    @Arg("collectionData") collectionData: CollectionInput
  ): Promise<CellCollection> {
    const collection = await this.collectonService.addCollection(collectionData);
    return collection;
  }
}
