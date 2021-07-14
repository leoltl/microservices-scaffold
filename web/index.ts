import fastify from "fastify";
import mercurius, { Loader, MercuriusContext } from "mercurius";
import { ModelRepository } from "../src/repository";
import makeDataLoaders from "../src/dataloaders";

import type { Db } from "mongodb";
import type { DataLoader } from "../src/dataloaders";
import type { Schema } from "../src/graphql/schema";
import type { Repositories } from '../src/repository';

type ReferenceLoader = Loader<Record<string, string>, any, MercuriusContext & { dataLoaders: DataLoader }>;

const resolveProductReference: ReferenceLoader = async function (queries, context) {
  const { dataLoaders: { productLoader } } = context;
  return queries.map(({ obj }) => productLoader().load(obj.id));
};

async function initServer({ federationSchema, resolversMap }: Schema, _repository: Repositories) {
  const server = fastify({
    logger: true
  });

  server.register(mercurius, {
    schema: federationSchema,
    resolvers: resolversMap,
    federationMetadata: true,
    graphiql: true,
    loaders: { 
      Model: { __resolveReference: resolveProductReference },
    },
    context: () => ({
      repository: _repository,
      dataLoaders: makeDataLoaders(_repository),
    })
  });

  server.get("/", async function (request, reply) {
    const query = " { _service { sdl } }";
    return server.graphql(query);
  });

  return server;
}

async function startServer(schema: Schema, _db: Promise<Db>): Promise<void> {
  const db = await _db

  const repositories = {
    model: new ModelRepository(db.collection("products"))
  }

  const server = await initServer(
    schema,
    repositories
  );

  server.listen(process.env.PORT || 8080, "::", function (err, address) {
    if (err) {
      server.log.error(err);
      process.exit(1);
    }
    server.log.info(`server listening on ${address}`);
  });
}

export default startServer;
