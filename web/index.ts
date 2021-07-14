import { FastifyInstance } from "fastify";

async function startServer(server: FastifyInstance): Promise<void> {
  server.listen(process.env.PORT || 8082, "::", function (err, address) {
    if (err) {
      server.log.error(err);
      process.exit(1);
    }
    server.log.info(`server listening on ${address}`);
  });
}

export default startServer;
