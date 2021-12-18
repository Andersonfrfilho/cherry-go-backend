import { classToClass } from "class-transformer";
import { inject, injectable } from "tsyringe";
import * as uuid from "uuid";

import { Service } from "@modules/accounts/infra/typeorm/entities/Services";
import { ProvidersRepositoryInterface } from "@modules/accounts/repositories/Providers.repository.interface";
import { TagsRepositoryInterface } from "@modules/tags/repositories/Tags.repository.interface";
import { PaymentProviderInterface } from "@shared/container/providers/PaymentProvider/Payment.provider.interface";
import { AppError } from "@shared/errors/AppError";
import { NOT_FOUND } from "@shared/errors/constants";

interface ParamsDTO {
  provider_id: string;
  service_id: string;
}
@injectable()
class DeleteServiceProviderService {
  constructor(
    @inject("ProvidersRepository")
    private providersRepository: ProvidersRepositoryInterface,
    @inject("TagsRepository")
    private tagsRepository: TagsRepositoryInterface,
    @inject("PaymentProvider")
    private paymentProvider: PaymentProviderInterface
  ) {}
  async execute({ provider_id, service_id }: ParamsDTO): Promise<Service[]> {
    const provider = await this.providersRepository.findById(provider_id);

    if (!provider) {
      throw new AppError(NOT_FOUND.PROVIDER_DOES_NOT_EXIST);
    }

    const service_found = provider.services.find(
      (service) => service.id === service_id
    );

    if (!service_found) {
      throw new AppError(NOT_FOUND.SERVICE_PROVIDER_DOES_NOT_EXIST);
    }

    if (
      !service_found?.details?.stripe?.product?.id ||
      !service_found?.details?.stripe?.price?.id
    ) {
      throw new AppError(NOT_FOUND.STRIPE_DETAILS_NOT_FOUND);
    }

    await this.paymentProvider.deleteProduct({
      price_id: service_found?.details?.stripe?.price?.id,
      product_id: service_found?.details?.stripe?.product?.id,
    });

    const tags_delete = await this.tagsRepository.getTagsByService(
      service_found.id
    );

    await this.tagsRepository.deleteTagsService(
      tags_delete.map((tag_service) => tag_service.id)
    );

    await this.providersRepository.deleteServiceProvider(service_found.id);

    const new_provider = await this.providersRepository.findById(provider_id);

    return classToClass(new_provider.services);
  }
}
export { DeleteServiceProviderService };
