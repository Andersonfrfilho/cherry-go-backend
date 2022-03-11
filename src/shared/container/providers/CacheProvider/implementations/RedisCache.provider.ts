import Redis, { Redis as RedisClient } from "ioredis";

import cacheConfig from "@config/cache";
import { CacheProviderInterface } from "@shared/container/providers/CacheProvider/Cache.provider.interface";

import { IOREDIS_EXPIRED_ENUM } from "../ioredis.cache.enums";

class RedisCacheProvider implements CacheProviderInterface {
  private client: RedisClient;
  constructor() {
    this.client = new Redis(cacheConfig.config.redis);
  }

  async invalidateAll(): Promise<void> {
    await this.client.flushdb();
  }

  async recover<T>(key: string): Promise<T | null> {
    const data = await this.client.get(key);

    if (!data) {
      return null;
    }

    const parsedData = JSON.parse(data) as T;
    return parsedData;
  }

  async save(
    key: string,
    value: any,
    expired_type: IOREDIS_EXPIRED_ENUM,
    time_invalide: number
  ): Promise<void> {
    await this.client.set(
      key,
      JSON.stringify(value),
      expired_type,
      time_invalide
    );
  }

  async invalidate(key: string): Promise<void> {
    await this.client.unlink(key);
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
