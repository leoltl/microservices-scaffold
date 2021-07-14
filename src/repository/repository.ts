import type { Collection } from "mongodb";
import { Model, ModelDoc, productMapper } from "./models";

export class ModelRepository {
  constructor(private collection: Collection<ModelDoc>) { }

  aggregate = this.collection.aggregate.bind(this.collection);

  async create(model: Model) {
    this.collection.insertOne(model);
  }

  async find(...args: Partial<Parameters<Collection["find"]>>) {
    const docs = await (
      await this.collection.find<ModelDoc>(...args)
    ).toArray();
    return docs.map(productMapper);
  }

  async findOne(...args: Partial<Parameters<Collection["find"]>>) {
    const [doc] = await (
      await this.collection.find<ModelDoc>(...args).limit(1)
    ).toArray();
    return productMapper(doc);
  }
}
