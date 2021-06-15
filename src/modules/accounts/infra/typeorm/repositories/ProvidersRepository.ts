import { getRepository, Repository } from "typeorm";

import {
  CreateProviderDaysAvailabilityServiceDTO,
  CreateProviderTimesAvailabilityServiceDTO,
} from "@modules/accounts/dtos";
import { Provider } from "@modules/accounts/infra/typeorm/entities/Provider";
import { ProviderAvailabilityDay } from "@modules/accounts/infra/typeorm/entities/ProviderAvailabilityDay";
import { ProviderAvailabilityTime } from "@modules/accounts/infra/typeorm/entities/ProviderAvailabilityTime";
import { ProvidersRepositoryInterface } from "@modules/accounts/repositories/ProvidersRepository.interface";

class ProvidersRepository implements ProvidersRepositoryInterface {
  private repository: Repository<Provider>;
  private repository_available_days: Repository<ProviderAvailabilityDay>;
  private repository_available_times: Repository<ProviderAvailabilityTime>;
  constructor() {
    this.repository = getRepository(Provider);
  }
  async createDaysAvailable({
    days,
    provider_id,
  }: CreateProviderDaysAvailabilityServiceDTO): Promise<void> {
    const days_found = await this.repository_available_days.find({
      where: { day: days },
    });
    await this.repository.update(provider_id, { days: days_found });
  }

  async createTimesAvailable({
    provider_id,
    times,
  }: CreateProviderTimesAvailabilityServiceDTO): Promise<void> {
    const times_save = await this.repository_available_times.save(times);
    await this.repository.update(provider_id, { hours: times_save });
  }

  async findById(id: string): Promise<Provider> {
    return this.repository.findOne(id);
  }

  createDay;
}
export { ProvidersRepository };
