import { container } from "tsyringe";

import { config } from "@config/environment";
import { VonageSmsProvider } from "@shared/container/providers/SmsProvider/implementations/VonageSmsProvider";
import { SmsProviderInterface } from "@shared/container/providers/SmsProvider/SmsProvider.interface";

const smsProvider = {
  vonage: container.resolve(VonageSmsProvider),
};

container.registerInstance<SmsProviderInterface>(
  "SmsProvider",
  smsProvider[config.sms.provider]
);
