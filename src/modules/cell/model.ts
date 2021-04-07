import { getModelForClass } from "@typegoose/typegoose";
import { ObjectId } from "mongodb";

import { Cell } from "../../entities";
import { CellInput } from "./input";

// This generates the mongoose model for us
export const CellMongooseModel = getModelForClass(Cell);

export default class CellModel {
  async getById(_id: ObjectId): Promise<Cell | null> {
    // Use mongoose as usual
    return CellMongooseModel.findById(_id).lean().exec();
  }

  async getManyById(_ids: ObjectId[]): Promise<Cell[] | null> {
    return CellMongooseModel.find().where('_id').in(_ids).lean().exec();
  }

  async create(data: CellInput): Promise<Cell> {
    const cell = new CellMongooseModel(data);

    return cell.save();
  }
}
