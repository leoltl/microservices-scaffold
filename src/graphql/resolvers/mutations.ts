
import { Ctx, Mutation, Resolver } from "type-graphql";
import { Model } from "../../models";
import Repository from "../../repository";

@Resolver(of => Model)
export class Mutations {
  @Mutation(returns => Model)
  async product(
    @Ctx("repository") repository: Repository
  ) {
    return await repository.create({});
  }
}
