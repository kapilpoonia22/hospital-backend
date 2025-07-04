// database.js
const { MongoClient } = require('mongodb');

const uri = 'mongodb://127.0.0.1:27017'; // local MongoDB
const client = new MongoClient(uri);

let db;

async function connectToMongo() {
  try {
    const client = await MongoClient.connect(mongoUrl);
    db = client.db(dbName);
    console.log("✅ MongoDB Connected");
  } catch (err) {
    console.error("❌ MongoDB Connection Error:", err);
  }
}

connectToMongo();


function getDb() {
  if (!db) {
    throw new Error('Database not initialized. Call mongoConnect first.');
  }
  return db;
}

module.exports = {
  mongoConnect,
  getDb
};
