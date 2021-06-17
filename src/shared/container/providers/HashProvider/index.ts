import { container } from "tsyringe";

import { HashProviderInterface } from "@shared/container/providers/HashProvider/HashProvider.interface";
import { BCryptHashProvider } from "@shared/container/providers/HashProvider/implementations/BCryptHashProvider";

container.registerSingleton<HashProviderInterface>(
  "HashProvider",
  BCryptHashProvider
);
