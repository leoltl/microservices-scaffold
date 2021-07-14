import "reflect-metadata";
import "./env";
import fastifyLoader from "./src/fastifyLoader";
import startServer from "./web";

fastifyLoader()
  .then(startServer)
  .catch(console.error);
