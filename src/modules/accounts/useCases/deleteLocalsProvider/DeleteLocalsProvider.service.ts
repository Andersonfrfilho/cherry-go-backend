import { inject, injectable } from "tsyringe";

import { ProviderAddress } from "@modules/accounts/infra/typeorm/entities/ProviderAddress";
import { ProvidersRepositoryInterface } from "@modules/accounts/repositories/Providers.repository.interface";
import { AddressesRepositoryInterface } from "@modules/addresses/repositories/Addresses.repository.interface";
import { PaymentProviderInterface } from "@shared/container/providers/PaymentProvider/Payment.provider.interface";
import { AppError } from "@shared/errors/AppError";
import { FORBIDDEN, NOT_FOUND } from "@shared/errors/constants";

interface Params {
  provider_id: string;
  provider_addresses_ids: string[];
}
@injectable()
export class DeleteLocalsProviderService {
  constructor(
    @inject("ProvidersRepository")
    private providersRepository: ProvidersRepositoryInterface,
    @inject("AddressesRepository")
    private addressesRepository: AddressesRepositoryInterface,
    @inject("PaymentProvider")
    private paymentProvider: PaymentProviderInterface
  ) {}
  async execute({
    provider_id,
    provider_addresses_ids,
  }: Params): Promise<ProviderAddress[]> {
    const provider = await this.providersRepository.findById(provider_id);

    if (!provider) {
      throw new AppError(NOT_FOUND.PROVIDER_DOES_NOT_EXIST);
    }

    const locals = await this.providersRepository.getProviderLocals(
      provider_id
    );

    const locals_remove = locals.filter((local) =>
      provider_addresses_ids.some((address_id) => local.id === address_id)
    );

    if (!(locals_remove.length === provider_addresses_ids.length)) {
      throw new AppError(FORBIDDEN.LOCALS_BELONGS_TO_ANOTHER_PROVIDER);
    }

    if (
      !locals_remove.every(
        (local) =>
          local?.details?.stripe?.product_id && local?.details?.stripe?.price_id
      )
    ) {
      throw new AppError(NOT_FOUND.STRIPE_DETAILS_NOT_FOUND);
    }

    const remove_stripe = locals.map(async (local) =>
      this.paymentProvider.deleteProduct({
        product_id: local.details.stripe.product_id,
        price_id: local.details.stripe.price_id,
      })
    );

    await Promise.all(remove_stripe);

    await this.providersRepository.deleteProviderLocals(provider_addresses_ids);

    await this.addressesRepository.delete(
      locals_remove.map((local) => local.address_id)
    );

    const provider_locals = await this.providersRepository.getProviderLocals(
      provider_id
    );
    return provider_locals;
  }
}
