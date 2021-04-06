import { getModelForClass } from "@typegoose/typegoose";
import { ObjectId } from "mongodb";

import { CellCollection } from "../../entities";
import { CellCollectionInput } from "./input";

// This generates the mongoose model for us
export const CollectionMongooseModel = getModelForClass(CellCollection);

export default class CellModel {
  async getById(_id: ObjectId): Promise<CellCollection | null> {
    // Use mongoose as usual
    return CollectionMongooseModel.findById(_id).lean().exec();
  }

  async create(data: CellCollectionInput): Promise<CellCollection> {
    const collection = new CollectionMongooseModel(data);

    return collection.save();
  }
}
