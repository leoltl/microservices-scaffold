import fastify from "fastify";
import mercurius, { Loader, MercuriusContext } from "mercurius";
import connect from "../database";
import { ModelRepository } from "./repository";
import makeDataLoaders from "./dataloaders";
import schema from "./graphql/schema";

import type { DataLoader } from "./dataloaders";

type ReferenceLoader = Loader<Record<string, string>, any, MercuriusContext & { dataLoaders: DataLoader }>;

const resolveProductReference: ReferenceLoader = async function (queries, context) {
  const { dataLoaders: { productLoader } } = context;
  return queries.map(({ obj }) => productLoader().load(obj.id));
};

async function initServer() {
  const server = fastify({
    logger: true
  });

  const db = await connect();

  const repositories = {
    model: new ModelRepository(db.collection("products"))
  }

  const { federationSchema, resolversMap } = schema;

  server.register(mercurius, {
    schema: federationSchema,
    resolvers: resolversMap,
    federationMetadata: true,
    graphiql: true,
    loaders: { 
      Model: { __resolveReference: resolveProductReference },
    },
    context: () => ({
      repository: repositories,
      dataLoaders: makeDataLoaders(repositories),
    })
  });

  server.get("/", async function (request, reply) {
    const query = " { _service { sdl } }";
    return server.graphql(query);
  });

  return server;
}

export default initServer;
