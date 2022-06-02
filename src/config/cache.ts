import { RedisOptions } from "ioredis";

import { config } from "@config/environment";

interface ICacheConfig {
  driver: "redis";
  config: {
    redis: RedisOptions;
  };
}

export default {
  driver: config.cache.driver,
  config: {
    redis: {
      host: config.cache.url,
      port: config.cache.port,
      password: config.cache.password,
    },
  },
} as ICacheConfig;
