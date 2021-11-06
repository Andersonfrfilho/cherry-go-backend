import { container } from "tsyringe";

import { config } from "@config/environment";

import { StripeProvider } from "./implementations/Stripe.provider";
import { PaymentProviderInterface } from "./Payment.provider.interface";

const paymentProvider = {
  stripe: StripeProvider,
};

container.registerSingleton<PaymentProviderInterface>(
  "PaymentProvider",
  paymentProvider[config.payment.provider]
);
