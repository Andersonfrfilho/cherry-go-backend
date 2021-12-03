import { container } from "tsyringe";

import { config } from "@config/environment";

import { AddressProviderInterface } from "./Address.provider.interface";
import { AddressProvider } from "./implementations/Address.provider";

container.registerSingleton<AddressProviderInterface>(
  "AddressProvider",
  AddressProvider
);
