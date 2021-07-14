import { ObjectId } from "mongodb";
import { Arg, Ctx, Query, Resolver } from "type-graphql";
import { Model } from "../../models";
import Repository from "../../repository";

@Resolver(of => Model)
export class Queries {
  @Query(returns => Model, { nullable: true })
  async product(
    @Arg("id") id: string,
    @Ctx("repository") repository: Repository
  ) {
    return await repository.findOne({ _id: new ObjectId(id) });
  }

  @Query(returns => [Model])
  async products(
    @Ctx("repository") repository: Repository
  ) {
    return await repository.find();
  }
}
