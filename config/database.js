const { MongoClient } = require('mongodb');

class Database {
  constructor() {
    this.client = new MongoClient(process.env.MONGODB_URI || 'mongodb://localhost:27017');
    this.db = null;
  }

  async connect() {
    try {
      await this.client.connect();
      this.db = this.client.db('pizza_y_punto');
      console.log('Connected to MongoDB');
    } catch (error) {
      console.error('Database connection error:', error);
      process.exit(1);
    }
  }

  getCollection(collectionName) {
    return this.db.collection(collectionName);
  }

  async disconnect() {
    await this.client.close();
  }
}

module.exports = new Database();