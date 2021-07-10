import Redis, { Redis as RedisClient } from "ioredis";

import cacheConfig from "@config/cache";
import { CacheProviderInterface } from "@shared/container/providers/CacheProvider/Cache.provider.interface";

class RedisCacheProvider implements CacheProviderInterface {
  private client: RedisClient;
  constructor() {
    this.client = new Redis(cacheConfig.config.redis);
  }
  async recover<T>(key: string): Promise<T | null> {
    const data = await this.client.get(key);

    if (!data) {
      return null;
    }

    const parsedData = JSON.parse(data) as T;
    return parsedData;
  }
  async save(key: string, value: any): Promise<void> {
    await this.client.set(key, JSON.stringify(value));
  }

  async invalidate(key: string): Promise<void> {
    console.log(key);
  }

  async invalidatePrefix(prefix: string): Promise<void> {
    const keys = await this.client.keys(`${prefix}:*`);
    const pipeline = this.client.pipeline();
    keys.forEach((key) => {
      pipeline.del(key);
    });
    await pipeline.exec();
  }
}
export { RedisCacheProvider };
