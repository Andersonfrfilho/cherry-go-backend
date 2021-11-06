import { Stripe } from "stripe";

import { config } from "@config/environment";

import { CreateAccountClientPaymentDTO } from "../dtos/CreateAccountClientPayment.dto";
import { UpdateAccountClientPaymentDTO } from "../dtos/UpdateAccountClientPayment.dto";
import { STRIPE_TAX_ID_VALUE } from "../enums/stripe.enums";
import { PaymentProviderInterface } from "../Payment.provider.interface";

export async function getStripeJS(): Promise<Stripe> {
  const stripe = new Stripe(config.payment.stripe.secret_key, {
    apiVersion: "2020-08-27",
  });
  return stripe;
}
export class StripeProvider implements PaymentProviderInterface {
  async createAccountClient({
    email,
    name,
    cpf,
  }: CreateAccountClientPaymentDTO): Promise<Stripe.Response<Stripe.Customer>> {
    const stripe = await getStripeJS();

    const data = {
      email,
      name,
      tax_id_data: [
        {
          type: STRIPE_TAX_ID_VALUE.br_cpf,
          value: cpf,
        },
      ],
    };

    const account = await stripe.customers.create(data);

    return account;
  }

  async updateAccountClient({
    stripe_id,
    ...rest
  }: UpdateAccountClientPaymentDTO) {
    const stripe = await getStripeJS();

    await stripe.customers.update(stripe_id, rest);
  }
}
