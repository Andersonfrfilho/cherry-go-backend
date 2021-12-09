import { inject, injectable } from "tsyringe";
import * as uuid from "uuid";

import { ServicesProviderTypesEnum } from "@modules/accounts/enums/ServicesProviderTypes.enum";
import { ProviderAddress } from "@modules/accounts/infra/typeorm/entities/ProviderAddress";
import { ProvidersRepositoryInterface } from "@modules/accounts/repositories/Providers.repository.interface";
import { AddressesRepositoryInterface } from "@modules/addresses/repositories/Addresses.repository.interface";
import { CreateProductStripeInterface } from "@shared/container/providers/PaymentProvider/implementations/Stripe.provider";
import { PaymentProviderInterface } from "@shared/container/providers/PaymentProvider/Payment.provider.interface";
import { AppError } from "@shared/errors/AppError";
import { NOT_FOUND } from "@shared/errors/constants";

interface ParamsDTO {
  amount: number;
  city: string;
  complement: string;
  country: string;
  district: string;
  number: string;
  reference: string;
  state: string;
  street: string;
  zipcode: string;
  provider_id: string;
  latitude?: string;
  longitude?: string;
}

@injectable()
export class CreateLocalProviderService {
  constructor(
    @inject("ProvidersRepository")
    private providersRepository: ProvidersRepositoryInterface,
    @inject("AddressesRepository")
    private addressesRepository: AddressesRepositoryInterface,
    @inject("PaymentProvider")
    private paymentProvider: PaymentProviderInterface
  ) {}
  async execute({
    amount,
    district,
    provider_id,
    city,
    complement,
    country,
    number,
    reference,
    state,
    street,
    zipcode,
    latitude,
    longitude,
  }: ParamsDTO): Promise<ProviderAddress[]> {
    const provider = await this.providersRepository.findById(provider_id);

    if (!provider) {
      throw new AppError(NOT_FOUND.PROVIDER_DOES_NOT_EXIST);
    }
    const address = await this.addressesRepository.create({
      city,
      complement,
      country,
      number,
      reference,
      state,
      street,
      zipcode,
      district,
      latitude,
      longitude,
    });

    const code = uuid.v4();

    const {
      product,
      price,
    } = await this.paymentProvider.createProduct<CreateProductStripeInterface>({
      active: true,
      amount,
      description: `${street}, ${number} - ${zipcode}`,
      name: code,
      service_type: ServicesProviderTypesEnum.local,
    });

    const details = {
      stripe: {
        product: { id: product.id },
        price: { id: price.id },
      },
    };

    await this.providersRepository.createProviderLocals({
      amount,
      active: true,
      address_id: address.id,
      provider_id,
      details,
    });

    const provider_locals = await this.providersRepository.getProviderLocals(
      provider_id
    );

    return provider_locals;
  }
}
