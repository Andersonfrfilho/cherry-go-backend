import { isAfter, isBefore } from "date-fns";
import { inject, injectable } from "tsyringe";

import { CreateProviderTimesAvailabilityServiceDTO } from "@modules/accounts/dtos";
import { DeleteProviderTimesAvailabilitiesServiceDTO } from "@modules/accounts/dtos/services/DeleteProviderTimesAvailabilities.service.dto";
import { ProviderAvailabilityTime } from "@modules/accounts/infra/typeorm/entities/ProviderAvailabilityTime";
import { ProvidersAvailabilityTimeRepositoryInterface } from "@modules/accounts/repositories/ProviderAvailabilityTime.repository.interface";
import { ProvidersRepositoryInterface } from "@modules/accounts/repositories/Providers.repository.interface";
import { DateProviderInterface } from "@shared/container/providers/DateProvider/Date.provider.interface";
import { AppError } from "@shared/errors/AppError";
import { BAD_REQUEST, FORBIDDEN, NOT_FOUND } from "@shared/errors/constants";

@injectable()
export class DeleteProviderTimesAvailabilitiesService {
  constructor(
    @inject("ProvidersRepository")
    private providersRepository: ProvidersRepositoryInterface,
    @inject("ProvidersAvailabilityTimeRepository")
    private providerAvailabilityTimeRepository: ProvidersAvailabilityTimeRepositoryInterface
  ) {}
  async execute({
    hour_id,
    provider_id,
  }: DeleteProviderTimesAvailabilitiesServiceDTO): Promise<
    ProviderAvailabilityTime[]
  > {
    const provider = await this.providersRepository.findById(provider_id);

    if (!provider) {
      throw new AppError(NOT_FOUND.PROVIDER_DOES_NOT_EXIST);
    }

    const hour_exist = await this.providerAvailabilityTimeRepository.findById(
      hour_id
    );

    if (!hour_exist) {
      throw new AppError(NOT_FOUND.PERIOD_NOT_FOUND);
    }

    if (!(hour_exist.provider_id === provider_id)) {
      throw new AppError(FORBIDDEN.PERIOD_BELONGS_TO_ANOTHER_PROVIDER);
    }

    await this.providersRepository.excludeProviderHourAvailable(hour_id);

    const new_hours = await this.providersRepository.findByProviderHoursAvailable(
      provider_id
    );

    return new_hours;
  }
}
