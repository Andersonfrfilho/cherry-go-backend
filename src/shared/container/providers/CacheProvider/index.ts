import { container } from "tsyringe";

import { CacheProviderInterface } from "@shared/container/providers/CacheProvider/CacheProvider.interface";
import { RedisCacheProvider } from "@shared/container/providers/CacheProvider/implementations/RedisCacheProviders";

const providers = {
  redis: RedisCacheProvider,
};
container.registerSingleton<CacheProviderInterface>(
  "CacheProvider",
  providers.redis
);
