import { container } from "tsyringe";

import { HashProviderInterface } from "@shared/container/providers/HashProvider/Hash.provider.interface";
import { BCryptHashProvider } from "@shared/container/providers/HashProvider/implementations/BCryptHashProvider";

container.registerSingleton<HashProviderInterface>(
  "HashProvider",
  BCryptHashProvider
);
