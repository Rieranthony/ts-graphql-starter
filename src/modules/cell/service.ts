import { Service } from "typedi";
import { ObjectId } from "mongodb";

import CellModel from "./model";
import { Cell } from "../../entities";
import { CellInput } from "./input";

@Service() // Dependencies injection
export default class CellService {
  constructor(private readonly cellModel: CellModel) {}

  public async getById(_id: ObjectId): Promise<Cell | null> {
    return this.cellModel.getById(_id);
  }

  public async addCell(data: CellInput): Promise<Cell> {
    const newCell = await this.cellModel.create(data);

    // Business logic goes here
    // Example:
    // Trigger push notification, analytics, ...

    return newCell;
  }
}
