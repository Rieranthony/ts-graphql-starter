import { Resolver, Arg, Query, Mutation, ID, FieldResolver, Root } from "type-graphql";
import { Service } from "typedi";
import { ObjectId } from "mongodb";

import { CellCollection, Cell } from "../../entities";
import { CellCollectionInput } from "./input";
import CollectionService from "./service";
import CellService from "../cell/service";

/*
  IMPORTANT: Your business logic must be in the service!
*/

@Service() // Dependencies injection
@Resolver((of) => CellCollection)
export default class CollectionResolver {
  constructor(
    private readonly collectonService: CollectionService,
    private readonly cellService: CellService
    ) {}

  @Query((returns) => CellCollection)
  async getCollection(@Arg("id") id: ObjectId) {
    const collecton = await this.collectonService.getById(id);
    return collecton;
  }

  @Query((returns) => [CellCollection])
  async getCollections(@Arg("limit", {nullable: true}) limit?: number) {
    const collections = await this.collectonService.findAll(limit);
    return collections
  }

  @Mutation((returns) => CellCollection)
  async createCollection(@Arg("collectionData") collectionData: CellCollectionInput) {
    const cellCollection = await this.collectonService.addCollection(collectionData);
    return cellCollection
  }

  @FieldResolver()
  async cells(@Root() cellCollection: CellCollection) {
    const cells = await this.cellService.getManyById(cellCollection.cells as ObjectId[])
    return cells
  }

}
