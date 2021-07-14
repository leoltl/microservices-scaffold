import mercurius from "mercurius";
import { printSchemaWithDirectives } from "graphql-tools";
import { buildSchemaSync, createResolversMap } from "type-graphql";
import { ModelResolver } from "./resolvers";

const _schema = buildSchemaSync({
  resolvers: [...ModelResolver],
  orphanedTypes: [],
  emitSchemaFile: true
});
const resolversMap = createResolversMap(_schema);

const { buildFederationSchema } = mercurius;

const _schemaStr = printSchemaWithDirectives(_schema).replace("schema {\n  query: Query\n  mutation: Mutation\n}", "");

// workaround for https://github.com/mercurius-js/mercurius/issues/273
const schemaStr = _schemaStr.replace("type Query {", "type Query @extends {").replace("type Mutation {", "type Mutation @extends {");

const federationSchema = buildFederationSchema(schemaStr);

const exportDefualt = {
  federationSchema,
  resolversMap
};

export type Schema = typeof exportDefualt;

export default exportDefualt;
