import { MongoClient } from 'mongodb';

class DBClient {
  constructor() {
    const host = process.env.DB_HOST || 'localhost';
    const port = process.env.DB_PORT || 27017;
    const database = process.env.DB_DATABASE || 'files_manager';

    const url = `mongodb://${host}:${port}/${database}`;

    this.client = new MongoClient(url, { useUnifiedTopology: true });

    this.isReady = false;

    this.client.connect((error) => {
      if (error) {
        console.error('Error connecting to MongoDB:', error);
      } else {
        this.isReady = true;
      }
    });
  }

  async isAlive() {
    return this.isReady;
  }

  async nbUsers() {
    if (!this.isReady) {
      return 0;
    }

    const collection = this.client.db().collection('users');
    const count = await collection.countDocuments();

    return count;
  }

  async nbFiles() {
    if (!this.isReady) {
      return 0;
    }

    const collection = this.client.db().collection('files');
    const count = await collection.countDocuments();

    return count;
  }
}

const dbClient = new DBClient();
export default dbClient;
