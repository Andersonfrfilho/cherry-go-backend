import { container } from "tsyringe";

import { ICacheProvider } from "@shared/container/providers/CacheProvider/ICacheProvider";
import { RedisCacheProvider } from "@shared/container/providers/CacheProvider/implementations/RedisCacheProviders";

const providers = {
  redis: RedisCacheProvider,
};
container.registerSingleton<ICacheProvider>("CacheProvider", providers.redis);
