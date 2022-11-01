import { MongoClient } from "mongodb";

const user = process.env.MONGODB_USER;
const pass = process.env.MONGODB_PASSWORD;
const database = process.env.MONGODB_DATABASE;

const uri = `mongodb://${user}:${pass}@ac-yw77jnr-shard-00-00.7gwuoqk.mongodb.net:27017,ac-yw77jnr-shard-00-01.7gwuoqk.mongodb.net:27017,ac-yw77jnr-shard-00-02.7gwuoqk.mongodb.net:27017/?ssl=true&replicaSet=atlas-elxqug-shard-0&authSource=admin&retryWrites=true&w=majority`;

async function handler(req, res) {
  if (req.method === "POST") {
    const data = req.body;

    const client = await MongoClient.connect(uri);
    const db = client.db(database);
    const collection = db.collection("meetups");

    const result = await collection.insertOne(data);
    console.log(result);

    res.status(201).json({ message: "Data inserted!" });

    client.close();
  }
}

export default handler;
