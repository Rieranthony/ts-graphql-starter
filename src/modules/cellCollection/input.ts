import { Field, InputType, ID } from "type-graphql";
import { MaxLength, MinLength } from "class-validator";
import { ObjectId } from "mongodb";

@InputType()
export class CellCollectionInput {
  @Field()
  @MaxLength(300)
  @MinLength(1)
  name!: string;

  @Field((type) => [ObjectId])
  cells!: string[];

}
