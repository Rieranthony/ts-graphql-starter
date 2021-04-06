import { Field, InputType, ID } from "type-graphql";
import { MaxLength, MinLength } from "class-validator";

@InputType()
export class CellInput {
  @Field()
  @MaxLength(300)
  @MinLength(1)
  type: string;

}
