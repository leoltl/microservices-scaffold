import makeProductLoader from "./ProductLoader";

import type { Repositories } from "../repository";

function makeDataLoaders(repository: Repositories) {
  const productLoader = () => makeProductLoader(repository);

  return {
    productLoader
  };
}

export type DataLoader = ReturnType<typeof makeDataLoaders>;

export default makeDataLoaders;
