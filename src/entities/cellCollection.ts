import { ObjectType, Field, ID } from "type-graphql";
import { prop } from "@typegoose/typegoose";
import { ObjectId } from "mongodb";
import { Cell } from './cell'
import { Ref } from '../utils/types'

@ObjectType()
export class CellCollection {
  // @Field(type => ID)
  @Field()
  readonly _id!: ObjectId;

  @prop({default: new Date(), required: true})
  @Field(() => Date)
  createdAt!: Date;

  @prop({default: new Date(), required: true})
  @Field(() => Date)
  updatedAt!: Date;

  @prop({required: true})
  @Field()
  name!: string;

  @prop({ref: Cell, required: true})
  @Field(type => [Cell])
  cells: Ref<Cell>[];

}
