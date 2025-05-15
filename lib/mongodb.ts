// lib/mongodb.ts
import { MongoClient } from "mongodb";

if (!process.env.MONGODB_URI) {
  throw new Error("Define MONGODB_URI en tu .env");
}

const uri = process.env.MONGODB_URI;
let client: MongoClient;
let clientPromise: Promise<MongoClient>;

if (process.env.NODE_ENV === "development") {
  // Evitamos múltiples conexiones en dev
  if (!(global as unknown as { _mongoClientPromise?: Promise<MongoClient> })._mongoClientPromise) {
    client = new MongoClient(uri);
    (global as unknown as { _mongoClientPromise?: Promise<MongoClient> })._mongoClientPromise = client.connect();
  }
  clientPromise = (global as unknown as { _mongoClientPromise?: Promise<MongoClient> })._mongoClientPromise!;
} else {
  client = new MongoClient(uri);
  clientPromise = client.connect();
}

export default clientPromise;
