import { ObjectType, Field } from "type-graphql";
import { prop } from "@typegoose/typegoose";
import { ObjectId } from "mongodb";

@ObjectType()
export class CellCollection {
  @Field()
  readonly _id!: ObjectId;

  @prop()
  @Field(() => Date)
  createdAt!: Date;

  @prop()
  @Field(() => Date)
  updatedAt!: Date;

  @prop()
  @Field()
  name!: string;

  @prop()
  @Field()
  cell_ids!: ObjectId[];

}
