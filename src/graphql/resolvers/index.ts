import { NonEmptyArray } from "type-graphql";
import { Queries } from "./queries";
import { Mutations } from "./mutations";

export const ModelResolver: NonEmptyArray<typeof Queries | typeof Mutations> = [
  Queries,
  Mutations
];
