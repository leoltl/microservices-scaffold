import { WithId } from "mongodb";
import { Field, ID, ObjectType } from "type-graphql";

@ObjectType()
export class Model {
  @Field(type => ID)
  id: string;

  @Field()
  title: string;
}

export type ModelDoc = WithId<Omit<Model, "id">>;

export const productMapper = (document: ModelDoc): Model | null => {
  if (!document) return null;
  return {
    id: document._id.toHexString(),
    ...document
  };
};
