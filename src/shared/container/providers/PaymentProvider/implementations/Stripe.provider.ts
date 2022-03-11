import { readFileSync } from "fs";
import { resolve } from "path";
import { Stripe } from "stripe";

import { config } from "@config/environment";
import upload from "@config/upload";

import { ConfirmAccountPaymentDTO } from "../dtos/ConfirmAccountPayment.dto";
import { CreateAccountBankAccountDTO } from "../dtos/CreateAccountBankAccount.dto";
import { CreateAccountClientPaymentDTO } from "../dtos/CreateAccountClientPayment.dto";
import { CreateAccountPaymentDTO } from "../dtos/CreateAccountPayment.dto";
import { CreateOrderDTO } from "../dtos/CreateOrder.dto";
import { CreateProductDTO } from "../dtos/CreateProduct.dto";
import { DeleteAccountBankAccountDTO } from "../dtos/DeleteAccountBankAccount.dto";
import { DeleteProductDTO } from "../dtos/DeleteProduct.dto";
import { PaymentOrderDTO } from "../dtos/PaymentOrder.dto";
import { UpdateAccountClientPaymentDTO } from "../dtos/UpdateAccountClientPayment.dto";
import { UpdateAccountPaymentDTO } from "../dtos/UpdateAccountPayment.dto";
import { UpdatePersonAccountPaymentDTO } from "../dtos/UpdatePersonAccountPayment.dto";
import { UploadDocumentPaymentDTO } from "../dtos/UploadDocumentPayment.dto";
import {
  NATIONALITY_ISO_3166_2_ENUM,
  STRIPE_ACCOUNT_BANK_TYPE_ENUM,
  STRIPE_ACCOUNT_COUNTRY_ENUM,
  STRIPE_ACCOUNT_TYPE_ENUM,
  STRIPE_BUSINESS_PROFILE_CODE_MCC_ENUM,
  STRIPE_BUSINESS_TYPE_ENUM,
  STRIPE_CURRENCY_ENUM,
  STRIPE_INVENTORY_TYPE_SKU_ENUM,
  STRIPE_PERSON_GENDER_ENUM,
  STRIPE_POLITICAL_EXPOSURE_ENUM,
  STRIPE_TAX_ID_VALUE_ENUM,
} from "../enums/stripe.enums";
import { PaymentProviderInterface } from "../Payment.provider.interface";

export interface CreateProductStripeInterface {
  product: Stripe.Response<Stripe.Product>;
  price: Stripe.Response<Stripe.Price>;
  sku: Stripe.Response<Stripe.Sku>;
}
export async function getStripeJS(): Promise<Stripe> {
  const stripe = new Stripe(config.payment.stripe.secret_key, {
    apiVersion: "2020-08-27",
  });
  return stripe;
}

export class StripeProvider implements PaymentProviderInterface {
  async paymentOrder<T>({
    order_stripe_id,
    card,
  }: PaymentOrderDTO): Promise<T> {
    const stripe = await getStripeJS();
    const token = await stripe.tokens.create({
      card,
    });

    const order = await stripe.orders.pay(order_stripe_id, {
      source: token.id,
    });
    return order;
  }

  async createOrder({
    customer_stripe_id,
    itens,
  }: CreateOrderDTO): Promise<void> {
    const stripe_itens = itens.map((item) => ({
      type: "sku",
      parent: item.stripe.sku.id,
      currency: STRIPE_CURRENCY_ENUM.brl,
      amount: item.amount,
    }));

    const stripe = await getStripeJS();

    await stripe.orders.create({
      currency: STRIPE_CURRENCY_ENUM.brl,
      customer: customer_stripe_id,
      items: stripe_itens,
    });
  }

  async deleteProduct<T>({
    product_id,
    price_id,
  }: DeleteProductDTO): Promise<void> {
    const stripe = await getStripeJS();
    await stripe.products.update(product_id, { active: false });
    await stripe.prices.update(price_id, { active: false });
  }

  async createProduct({
    amount,
    active,
    name,
    description,
    service_type,
  }: CreateProductDTO): Promise<any> {
    const stripe = await getStripeJS();

    const product = await stripe.products.create({
      active,
      name,
      statement_descriptor: `${service_type} - cherry-go`.substring(0, 22),
      description,
    });

    const price = await stripe.prices.create({
      unit_amount: amount,
      currency: STRIPE_CURRENCY_ENUM.brl,
      product: product.id,
    });

    const sku = await stripe.skus.create({
      price: amount,
      currency: STRIPE_CURRENCY_ENUM.brl,
      inventory: { type: STRIPE_INVENTORY_TYPE_SKU_ENUM.infinite },
      product: product.id,
    });

    return {
      product,
      price,
      sku,
    };
  }

  async deleteAccountBankAccount({
    account_id,
    bank_account_id,
  }: DeleteAccountBankAccountDTO): Promise<Stripe.Response<Stripe.Account>> {
    const stripe = await getStripeJS();

    const account = await stripe.accounts.retrieve(account_id);

    await stripe.accounts.deleteExternalAccount(account.id, bank_account_id);

    const new_account_details = await stripe.accounts.retrieve(account_id);

    return new_account_details;
  }
  async getAccount(id: string): Promise<Stripe.Response<Stripe.Account>> {
    const stripe = await getStripeJS();
    const account = await stripe.accounts.retrieve(id);
    return account;
  }
  async updatePersonAccount({
    account_id,
    birth_date,
    first_name,
    last_name,
    email,
    cpf,
    gender,
    address,
    phone,
  }: UpdatePersonAccountPaymentDTO): Promise<void> {
    const stripe = await getStripeJS();

    const day = birth_date.getDate();
    const month = birth_date.getMonth() + 1;
    const year = birth_date.getFullYear();

    const {
      individual: { id: person_id },
    } = await stripe.accounts.retrieve(account_id);

    await stripe.accounts.updatePerson(account_id, person_id, {
      first_name,
      last_name,
      email,
      id_number: cpf,
      relationship: {
        owner: true,
      },
      gender: STRIPE_PERSON_GENDER_ENUM[gender],
      nationality: NATIONALITY_ISO_3166_2_ENUM.BR,
      political_exposure: STRIPE_POLITICAL_EXPOSURE_ENUM.none,
      dob: {
        // The day of birth, between 1 and 31.
        day,
        // The month of birth, between 1 and 12.
        month,
        // The four-digit year of birth.
        year,
      },
      address,
      phone,
    });
    await stripe.accounts.retrieve(account_id);
  }
  async createAccountBankAccount({
    bank_account,
    account_id,
  }: CreateAccountBankAccountDTO): Promise<
    Stripe.Response<Stripe.BankAccount | Stripe.Card>
  > {
    const stripe = await getStripeJS();

    const {
      account_holder_name,
      code_bank,
      country,
      account_holder_type,
      account_number,
      branch_number,
      currency,
    } = bank_account;

    const token = await stripe.tokens.create({
      bank_account: {
        country: country || STRIPE_ACCOUNT_COUNTRY_ENUM.br,
        currency: currency || STRIPE_CURRENCY_ENUM.brl,
        account_holder_name,
        account_holder_type:
          account_holder_type || STRIPE_ACCOUNT_BANK_TYPE_ENUM.individual,
        routing_number: `${code_bank}-${branch_number}`,
        account_number,
      },
    });

    const account = await stripe.accounts.createExternalAccount(account_id, {
      external_account: token.id,
    });

    await stripe.accounts.updateExternalAccount(account_id, account.id, {
      default_for_currency: true,
    });

    return account;
  }
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
      type: STRIPE_ACCOUNT_TYPE_ENUM.custom,
      country: STRIPE_ACCOUNT_COUNTRY_ENUM.br,
      email,
      capabilities: {
        card_payments: { requested: true },
        transfers: { requested: true },
      },
      business_type: STRIPE_BUSINESS_TYPE_ENUM.individual,
      business_profile: {
        mcc: STRIPE_BUSINESS_PROFILE_CODE_MCC_ENUM.dating_escort_services,
        url: `www.cherry-go.com`,
        name,
        support_url: "www.cherry-go.com/suporte",
        support_email: "suporte@cherry-go.com",
      },
    };

    const account = await stripe.accounts.create(data);

    // const day = birth_date.getDate();
    // const month = birth_date.getMonth() + 1;
    // const year = birth_date.getFullYear();
    // console.log("aquii");
    // const person = await stripe.accounts.createPerson(account.id, {
    //   first_name: name,
    //   last_name,
    //   email,
    //   id_number: rg,
    //   relationship: {
    //     owner: true,
    //   },
    //   gender: STRIPE_PERSON_GENDER[gender],
    //   nationality: NATIONALITY_ISO_3166_2_ENUM.BR,
    //   political_exposure: STRIPE_POLITICAL_EXPOSURE.none,
    //   dob: {
    //     // The day of birth, between 1 and 31.
    //     day,
    //     // The month of birth, between 1 and 12.
    //     month,
    //     // The four-digit year of birth.
    //     year,
    //   },
    // });

    // return { account: { id: account.id }, person: { id: person.id } };
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
          type: STRIPE_TAX_ID_VALUE_ENUM.br_cpf,
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
