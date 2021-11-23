import { container } from "tsyringe";

import { config } from "@config/environment";

import { BankProviderInterface } from "./Bank.provider.interface";
import { BrasilApiProvider } from "./implementations/BrasilApi.provider";

const bankProvider = {
  brasilApi: container.resolve(BrasilApiProvider),
};

container.registerInstance<BankProviderInterface>(
  "BankProvider",
  bankProvider[config.bank.provider]
);
