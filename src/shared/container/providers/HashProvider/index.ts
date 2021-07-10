import { container } from "tsyringe";

import { HashProviderInterface } from "@shared/container/providers/HashProvider/Hash.provider.interface";
import { BCryptHashProvider } from "@shared/container/providers/HashProvider/implementations/BCryptHash.provider";

container.registerSingleton<HashProviderInterface>(
  "HashProvider",
  BCryptHashProvider
);
