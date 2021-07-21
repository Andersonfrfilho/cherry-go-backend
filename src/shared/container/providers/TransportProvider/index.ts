import { container } from "tsyringe";

import { config } from "@config/environment";
import { VonageSmsProvider } from "@shared/container/providers/SmsProvider/implementations/VonageSms.provider";
import { SmsProviderInterface } from "@shared/container/providers/SmsProvider/Sms.provider.interface";

const smsProvider = {
  vonage: container.resolve(VonageSmsProvider),
};

container.registerInstance<SmsProviderInterface>(
  "SmsProvider",
  smsProvider[config.sms.provider]
);
