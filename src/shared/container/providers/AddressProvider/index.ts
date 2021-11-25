import { container } from "tsyringe";

import { config } from "@config/environment";

import { AddressProviderInterface } from "./Address.provider.interface";
import { BrasilApiAddress } from "./implementations/BrasilApiAddress.provider";

const addressProvider = {
  brasilApi: container.resolve(BrasilApiAddress),
};

container.registerInstance<AddressProviderInterface>(
  "AddressProvider",
  addressProvider[config.address.provider]
);
