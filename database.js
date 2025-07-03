// database.js
const { MongoClient } = require('mongodb');

const uri = 'mongodb://127.0.0.1:27017'; // local MongoDB
const client = new MongoClient(uri);

let db;

async function mongoConnect(callback) {
  try {
    await client.connect();
    db = client.db('hospitalBooking'); // database name
    console.log('✅ MongoDB Connected to hospitalBooking');
    callback();
  } catch (err) {
    console.error('❌ MongoDB connection failed:', err);
  }
}

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
