import { MongoClient } from "mongodb";

const user = process.env.MONGODB_USER;
const pass = process.env.MONGODB_PASSWORD;
const database = process.env.MONGODB_DATABASE;
const uri = `mongodb://${user}:${pass}@ac-rqwk8ib-shard-00-00.5xb1izf.mongodb.net:27017,ac-rqwk8ib-shard-00-01.5xb1izf.mongodb.net:27017,ac-rqwk8ib-shard-00-02.5xb1izf.mongodb.net:27017/?ssl=true&replicaSet=atlas-3fteix-shard-0&authSource=admin&retryWrites=true&w=majority`;

export async function Meetups() {
  const client = await MongoClient.connect(uri);
  const db = client.db(database);
  const meetupsCollection = db.collection("meetups");

  const meetups = await meetupsCollection.find().toArray();

  client.close();

  return meetups;
}
