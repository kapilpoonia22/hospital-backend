// database.js
const { MongoClient } = require('mongodb');

const mongoUrl = "mongodb+srv://pooniakapil59:kapil%401234@cluster0.gg8h1st.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
const dbName = "hospitalDB";

let db;

async function connectToMongo() {
  try {
    const client = await MongoClient.connect(mongoUrl);
    db = client.db(dbName);
    console.log("✅ MongoDB Connected to hospitalDB");
  } catch (err) {
    console.error("❌ MongoDB Connection Error:", err);
  }
}

function getDb() {
  if (!db) {
    throw new Error('Database not initialized. Call connectToMongo first.');
  }
  return db;
}

module.exports = {
  connectToMongo,
  getDb,
};
