import { container } from "tsyringe";

import { config } from "@config/environment";
import { SnsAwsSmsProvider } from "@shared/container/providers/SmsProvider/implementations/SnsAwsSms.provider";
import { SmsProviderInterface } from "@shared/container/providers/SmsProvider/Sms.provider.interface";

const smsProvider = {
  sns: container.resolve(SnsAwsSmsProvider),
};

container.registerInstance<SmsProviderInterface>(
  "SmsProvider",
  smsProvider[config.sms.provider]
);
