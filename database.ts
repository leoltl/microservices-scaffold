import { MongoClient } from "mongodb";
import type { Db } from "mongodb";

async function connect(): Promise<Db> {
  const db = await (
    await (
      new MongoClient(process.env.MONGO_URI, { useUnifiedTopology: true }
      )
    ).connect()).db();

  return db;
}

export default connect;
