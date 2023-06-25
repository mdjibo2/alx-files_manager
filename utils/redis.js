import redis from 'redis';

class RedisClient {
  constructor() {
    this.client = redis.createClient({ host: 'localhost', port: 6379 });

    this.isReady = false; // Track the ready state

    this.client.on('ready', () => {
      this.isReady = true; // Set the ready state to true when the client is ready
    });

    this.client.on('error', (error) => {
      console.error('Error connecting to Redis:', error);
    });

    this.waitForReady(); // Call the method to wait for the client to become ready
  }

  async waitForReady() {
    if (!this.isReady) {
      await new Promise((resolve) => {
        this.client.on('ready', () => {
          this.isReady = true; // Set the ready state to true
          resolve();
        });
      });
    }
  }

  isAlive() {
    return this.isReady;
  }

  async get(key) {
    return new Promise((resolve, reject) => {
      this.client.get(key, (error, value) => {
        if (error) {
          reject(error);
        } else {
          resolve(value);
        }
      });
    });
  }

  async set(key, value, duration) {
    return new Promise((resolve, reject) => {
      this.client.setex(key, duration, value, (error) => {
        if (error) {
          reject(error);
        } else {
          resolve();
        }
      });
    });
  }

  async del(key) {
    return new Promise((resolve, reject) => {
      this.client.del(key, (error, count) => {
        if (error) {
          reject(error);
        } else {
          resolve(count);
        }
      });
    });
  }
}

const redisClient = new RedisClient();
module.exports = redisClient;
