import "reflect-metadata";
import "./env";
import schema from "./src/graphql/schema";
import connect from "./database";
import startServer from "./web";

startServer(schema, connect())
  .catch(console.error);
