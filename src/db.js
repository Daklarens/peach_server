require("dotenv").config();
const e = require("express");
const { MongoClient, ObjectId } = require("mongodb");

const clientDB = MongoClient.connect(process.env.DB_URI,{
    useUnifiedTopology: true,
    poolSize:10,
});
const db = async () => {
  const client = await clientDB;
  const dbConnect = client.db("timerauth");
  return dbConnect;
}


module.exports = {
    db,
    ObjectId,
};

