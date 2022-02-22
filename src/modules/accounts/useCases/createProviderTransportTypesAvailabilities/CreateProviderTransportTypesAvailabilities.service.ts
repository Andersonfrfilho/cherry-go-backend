import { inject, injectable } from "tsyringe";
import * as uuid from "uuid";

import { CreateProviderTransportTypesAvailabilitiesServiceDTO } from "@modules/accounts/dtos";
import { ServicesProviderTypesEnum } from "@modules/accounts/enums/ServicesProviderTypes.enum";
import { ProviderTransportType } from "@modules/accounts/infra/typeorm/entities/ProviderTransportTypes";
import { ProvidersRepositoryInterface } from "@modules/accounts/repositories/Providers.repository.interface";
import { TRANSPORT_TYPES_ENUM } from "@modules/transports/enums/TransportsTypes.enum";
import { TransportsRepositoryInterface } from "@modules/transports/repositories/Transports.repository.interface";
import { CreateProductStripeInterface } from "@shared/container/providers/PaymentProvider/implementations/Stripe.provider";
import { PaymentProviderInterface } from "@shared/container/providers/PaymentProvider/Payment.provider.interface";
import { AppError } from "@shared/errors/AppError";
import { NOT_FOUND } from "@shared/errors/constants";

@injectable()
export class CreateProviderTransportTypesAvailabilitiesService {
  constructor(
    @inject("ProvidersRepository")
    private providersRepository: ProvidersRepositoryInterface,
    @inject("TransportsRepository")
    private transportsRepository: TransportsRepositoryInterface,
    @inject("PaymentProvider")
    private paymentProvider: PaymentProviderInterface
  ) {}
  async execute({
    provider_id,
    transports_types,
  }: CreateProviderTransportTypesAvailabilitiesServiceDTO): Promise<
    ProviderTransportType[]
  > {
    const provider = await this.providersRepository.findById({id:provider_id});

    if (!provider) {
      throw new AppError(NOT_FOUND.PROVIDER_DOES_NOT_EXIST);
    }

    const remove_transports_type = provider.transports_types.filter(
      (transport_type) =>
        !transports_types.some(
          (transport_type_create) =>
            transport_type_create.transport_type_id ===
            transport_type.transport_type_id
        )
    );

    if (remove_transports_type && remove_transports_type.length > 0) {
      const remove_product = remove_transports_type.find(
        (transport_type) =>
          transport_type.transport_type.name === TRANSPORT_TYPES_ENUM.PROVIDER
      );

      if (remove_product) {
        await this.paymentProvider.deleteProduct({
          product_id: remove_product.details.stripe.product.id,
          price_id: remove_product.details.stripe.price.id,
        });
      }

      await this.providersRepository.deleteProviderTransportType(
        remove_transports_type.map((transport_type) => transport_type.id)
      );
    }

    const update_transport_type = transports_types.filter((transport_type) =>
      provider.transports_types.some(
        (transport_provider) =>
          transport_type.transport_type_id ===
            transport_provider.transport_type_id && transport_type.amount
      )
    );

    const transports_types_available = await this.transportsRepository.getAllByActiveTransportType(
      true
    );

    if (update_transport_type.length > 0) {
      const provider_transport_type = provider.transports_types.find(
        (transport_type_provider) =>
          update_transport_type.every(
            (transport_type) =>
              transport_type.transport_type_id ===
              transport_type_provider.transport_type_id
          )
      );

      await this.paymentProvider.deleteProduct({
        price_id: provider_transport_type.details.stripe.price.id,
        product_id: provider_transport_type.details.stripe.product.id,
      });

      const details = {};

      const code = uuid.v4();

      const {
        product,
        price,
      } = await this.paymentProvider.createProduct<CreateProductStripeInterface>(
        {
          active: true,
          amount: update_transport_type[0].amount,
          description: `${update_transport_type[0].amount}/km`,
          name: code,
          service_type: ServicesProviderTypesEnum.transports,
        }
      );

      Object.assign(details, {
        stripe: {
          product: { id: product.id },
          price: { id: price.id },
        },
      });

      await this.providersRepository.updateTransportTypesAvailable({
        transport_type_provider_id: provider_transport_type.id,
        amount: update_transport_type[0].amount,
        details,
      });
    } else {
      const product_transport_type = transports_types.find((transport_type) =>
        transports_types_available.some(
          (transport_type_available) =>
            transport_type_available.id === transport_type.transport_type_id &&
            transport_type_available.name === TRANSPORT_TYPES_ENUM.PROVIDER
        )
      );

      const details = {};

      if (product_transport_type) {
        const code = uuid.v4();

        const {
          product,
          price,
        } = await this.paymentProvider.createProduct<CreateProductStripeInterface>(
          {
            active: true,
            amount: product_transport_type.amount,
            description: `${product_transport_type.amount}/km`,
            name: code,
            service_type: ServicesProviderTypesEnum.transports,
          }
        );

        Object.assign(details, {
          stripe: {
            product: { id: product.id },
            price: { id: price.id },
          },
        });
      }

      const formatted_transports_types = transports_types.map(
        (transport_type) => {
          if (
            transport_type.transport_type_id ===
            product_transport_type.transport_type_id
          ) {
            return {
              ...transport_type,
              details,
            };
          }
          return transport_type;
        }
      );

      await this.providersRepository.createTransportTypesAvailable({
        provider_id,
        transports_types: formatted_transports_types,
      });
    }

    const provider_new_info = await this.providersRepository.findById(
      provider_id
    );

    return provider_new_info.transports_types;
  }
}
