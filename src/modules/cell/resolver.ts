import { Resolver, Arg, Query, Mutation, ID } from "type-graphql";
import { Service } from "typedi";
import { ObjectId } from "mongodb";

import { Cell } from "../../entities";
import CellService from "./service";
import { CellInput } from "./input";

/*
  IMPORTANT: Your business logic must be in the service!
*/

@Service() // Dependencies injection
@Resolver((of) => Cell)
export default class CellResolver {
  constructor(private readonly todoService: CellService) {}

  @Query((returns) => Cell)
  async getCell(@Arg("id") id: ObjectId) {
    const todo = await this.todoService.getById(id);

    return todo;
  }

  @Mutation((returns) => Cell)
  async createCell(
    @Arg("cellData") cellData: CellInput
  ): Promise<Cell> {
    const todo = await this.todoService.addCell(cellData);
    return todo;
  }
}
