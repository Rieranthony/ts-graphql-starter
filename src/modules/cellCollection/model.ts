import { getModelForClass } from "@typegoose/typegoose";
import { isDefined, isNotEmpty } from "class-validator";
import { ObjectId } from "mongodb";

import { CellCollection, Cell } from "../../entities";
import { CellCollectionInput } from "./input";

// This generates the mongoose model for us
export const CellCollectionMongooseModel = getModelForClass(CellCollection);
const CellModel = getModelForClass(Cell)

export default class CellCollectionModel {
  async getById(_id: ObjectId): Promise<CellCollection | null> {
    // Use mongoose as usual
    return CellCollectionMongooseModel.findById(_id).lean().exec();
  }

  async getAll(limit?: number): Promise<CellCollection[] | null> {
    var query = CellCollectionMongooseModel
      .find({})
      .sort({'_id': -1})
      .lean()
    if (limit != null) {
      query = query.limit(limit)
    }
    return query.exec();
  }

  async create(data: CellCollectionInput): Promise<CellCollection> {
    // Throw an error if there's a missing cell
    const missingCells = await Promise.all(data.cells.map(
      async (_id: string): Promise<string | void> => {
        const exists = await CellModel.exists({_id: _id});
        if (exists === false) {
          return _id
        }
      })
    ).then((_) => _.filter(isDefined));
    if (missingCells.length > 0) {
      throw Error(`Tried to create a collection with ${missingCells.length} nonexistent cell _id(s): ${missingCells}`)
    }
    const collection = new CellCollectionMongooseModel(data);
    collection.save();
    // Convert to object, otherwise will get undefined for cells
    return collection.toObject()
  }
}
