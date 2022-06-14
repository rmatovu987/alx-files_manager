import { createClient } from 'redis';
import { promisify } from 'util';

class RedisClient {
  constructor() {
    this.client = createClient();
    this.client.on('error', (error) => {
      console.log(`Redis client not connected to the server: ${error}`);
    });
    this.getAsync = promisify(this.client.get).bind(this.client);
    this.setAsync = promisify(this.client.set).bind(this.client);
    this.expireAsync = promisify(this.client.expire).bind(this.client);
    this.delAsync = promisify(this.client.del).bind(this.client);
  }

  isAlive() {
    return this.client.connected;
  }

  async get(key) {
    return this.getAsync(key);
  }

  async set(key, value, duration) {
    this.setAsync(key, value);
    this.expireAsync(key, duration);
  }

  async del(key) {
    this.delAsync(key);
  }
}
const redisClient = new RedisClient();
module.exports = redisClient;
