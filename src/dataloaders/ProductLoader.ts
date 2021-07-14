import * as DataLoader from "dataloader";
import { ObjectId } from "mongodb";

import type { Model } from "../models";
import type { Repositories, ModelRepository } from "../repository";

async function batchGetProductById(repo: ModelRepository, ids: readonly ObjectId[]): Promise<Array<Model | Error>> {
  const results = await repo.find({ _id: { $in: ids } });
  const map = new Map<string, Model>();

  results.forEach((product) => map.set(product.id, product));

  return ids.map((id) => id.toHexString()).map((key) => map.get(key) ?? new Error(`No result for ${key}`));
}

function makeProductLoader(repositories: Repositories): DataLoader<ObjectId | string, Model> {
  return new DataLoader(
    (_keys) => {
      const keys = _keys.map((k) => new ObjectId(k));
      return batchGetProductById(repositories.model, keys);
    },
    { cacheKeyFn: (key) => key.toString() }
  );
}

export default makeProductLoader;
