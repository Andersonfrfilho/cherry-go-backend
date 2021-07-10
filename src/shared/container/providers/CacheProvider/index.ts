import { container } from "tsyringe";

import { CacheProviderInterface } from "@shared/container/providers/CacheProvider/Cache.provider.interface";
import { RedisCacheProvider } from "@shared/container/providers/CacheProvider/implementations/RedisCache.provider";

const providers = {
  redis: RedisCacheProvider,
};
container.registerSingleton<CacheProviderInterface>(
  "CacheProvider",
  providers.redis
);
