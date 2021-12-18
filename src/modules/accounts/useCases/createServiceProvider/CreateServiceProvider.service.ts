import { inject, injectable } from "tsyringe";
import * as uuid from "uuid";

import { CreateServiceProviderServiceDTO } from "@modules/accounts/dtos";
import { ServicesProviderTypesEnum } from "@modules/accounts/enums/ServicesProviderTypes.enum";
import { ProvidersRepositoryInterface } from "@modules/accounts/repositories/Providers.repository.interface";
import { TagsRepositoryInterface } from "@modules/tags/repositories/Tags.repository.interface";
import { CreateProductStripeInterface } from "@shared/container/providers/PaymentProvider/implementations/Stripe.provider";
import { PaymentProviderInterface } from "@shared/container/providers/PaymentProvider/Payment.provider.interface";
import { AppError } from "@shared/errors/AppError";
import { NOT_FOUND } from "@shared/errors/constants";

@injectable()
class CreateServiceProviderService {
  constructor(
    @inject("ProvidersRepository")
    private providersRepository: ProvidersRepositoryInterface,
    @inject("TagsRepository")
    private tagsRepository: TagsRepositoryInterface,
    @inject("PaymentProvider")
    private paymentProvider: PaymentProviderInterface
  ) {}
  async execute({
    provider_id,
    amount,
    duration,
    name,
    tags_id,
  }: CreateServiceProviderServiceDTO): Promise<void> {
    const provider = await this.providersRepository.findById(provider_id);

    if (!provider) {
      throw new AppError(NOT_FOUND.PROVIDER_DOES_NOT_EXIST);
    }

    const code = uuid.v4();

    const {
      product,
      price,
    } = await this.paymentProvider.createProduct<CreateProductStripeInterface>({
      active: true,
      amount,
      description: name,
      name: code,
      service_type: ServicesProviderTypesEnum.services,
    });

    const details = {
      stripe: {
        product: { id: product.id },
        price: { id: price.id },
      },
    };

    const service = await this.providersRepository.createServiceProvider({
      provider_id,
      amount,
      duration,
      name,
      active: true,
      details,
    });

    await this.tagsRepository.createTagService({
      tags_id,
      service_id: service.id,
    });
  }
}
export { CreateServiceProviderService };
