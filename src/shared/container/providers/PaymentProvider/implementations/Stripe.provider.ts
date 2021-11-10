import fs, { readFileSync } from "fs";
import { resolve } from "path";
import { Stripe } from "stripe";

import { config } from "@config/environment";
import upload from "@config/upload";

import { ConfirmAccountPaymentDTO } from "../dtos/ConfirmAccountPayment.dto";
import { CreateAccountClientPaymentDTO } from "../dtos/CreateAccountClientPayment.dto";
import { CreateAccountPaymentDTO } from "../dtos/CreateAccountPayment.dto";
import { UpdateAccountClientPaymentDTO } from "../dtos/UpdateAccountClientPayment.dto";
import { UpdateAccountPaymentDTO } from "../dtos/UpdateAccountPayment.dto";
import { UploadDocumentPaymentDTO } from "../dtos/UploadDocumentPayment.dto";
import {
  STRIPE_ACCOUNT_COUNTRY,
  STRIPE_ACCOUNT_TYPE,
  STRIPE_BUSINESS_PROFILE_CODE_MCC,
  STRIPE_BUSINESS_TYPE,
  STRIPE_TAX_ID_VALUE,
} from "../enums/stripe.enums";
import { PaymentProviderInterface } from "../Payment.provider.interface";

export async function getStripeJS(): Promise<Stripe> {
  const stripe = new Stripe(config.payment.stripe.secret_key, {
    apiVersion: "2020-08-27",
  });
  return stripe;
}

export class StripeProvider implements PaymentProviderInterface {
  // rever como remover arquivos
  async uploadAccountDocument({
    file_name,
    purpose,
  }: UploadDocumentPaymentDTO): Promise<Stripe.Response<Stripe.File>> {
    const stripe = await getStripeJS();

    const path = resolve(upload.tmpFolder, file_name);

    const fp = readFileSync(path);

    const document = await stripe.files.create({
      purpose,
      file: {
        data: fp,
        name: file_name,
        type: "application/octet-stream",
      },
    });

    return document;
  }

  async updateAccount({
    external_id,
    ...rest
  }: UpdateAccountPaymentDTO): Promise<void> {
    const stripe = await getStripeJS();

    await stripe.accounts.update(external_id, rest);
  }

  async confirmAccount({
    id,
    public_ip,
  }: ConfirmAccountPaymentDTO): Promise<void> {
    const stripe = await getStripeJS();
    const date = new Date().getTime();
    await stripe.accounts.update(id, {
      tos_acceptance: { date, ip: public_ip },
    });
  }

  async createAccount({
    email,
    name,
  }: CreateAccountPaymentDTO): Promise<Stripe.Response<Stripe.Account>> {
    const stripe = await getStripeJS();

    const data = {
      type: STRIPE_ACCOUNT_TYPE.custom,
      country: STRIPE_ACCOUNT_COUNTRY.br,
      email,
      capabilities: {
        card_payments: { requested: true },
        transfers: { requested: true },
      },
      business_type: STRIPE_BUSINESS_TYPE.individual,
      business_profile: {
        mcc: STRIPE_BUSINESS_PROFILE_CODE_MCC.dating_escort_services,
        url: `www.cherry-go.com`,
        name,
        support_url: "www.cherry-go.com/suporte",
        support_email: "suporte@cherry-go.com",
      },
    };

    const account = await stripe.accounts.create(data);

    return account;
  }

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
    external_id,
    ...rest
  }: UpdateAccountClientPaymentDTO) {
    const stripe = await getStripeJS();

    await stripe.customers.update(external_id, rest);
  }
}
