import { Service } from "typedi";
import { ObjectId } from "mongodb";

import CollectionModel from "./model";
import { CellCollection } from "../../entities";
import { CellCollectionInput } from "./input";

@Service() // Dependencies injection
export default class CollectionService {
  constructor(private readonly collectionModel: CollectionModel) {}

  public async getById(_id: ObjectId): Promise<CellCollection | null> {
    return this.collectionModel.getById(_id);
  }

  public async addCollection(data: CellCollectionInput): Promise<CellCollection> {
    const newCollection = await this.collectionModel.create(data);

    // Business logic goes here
    // Example:
    // Trigger push notification, analytics, ...

    return newCollection;
  }
}
