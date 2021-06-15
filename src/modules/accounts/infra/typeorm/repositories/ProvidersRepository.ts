import { time } from "console";
import { getRepository, Repository } from "typeorm";

import {
  CreateProviderDaysAvailabilityServiceDTO,
  CreateProviderTimesAvailabilityServiceDTO,
} from "@modules/accounts/dtos";
import { CreateProviderTimesAvailabilityProviderDTO } from "@modules/accounts/dtos/repositories/CreateProviderTimesAvailabilityProvider.dto";
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
    this.repository_available_days = getRepository(ProviderAvailabilityDay);
    this.repository_available_times = getRepository(ProviderAvailabilityTime);
  }
  async findByEmail(email: string): Promise<Provider> {
    return this.repository.findOne({ email });
  }
  async createDaysAvailable({
    days,
    provider_id,
  }: CreateProviderDaysAvailabilityServiceDTO): Promise<void> {
    const days_created = this.repository_available_days.create(
      days.map((day) => ({ day, provider_id }))
    );
    await this.repository_available_days.save(days_created);
  }

  async createTimesAvailable({
    provider_id,
    times,
  }: CreateProviderTimesAvailabilityProviderDTO): Promise<void> {
    const times_created = this.repository_available_times.create(
      times.map((time) => ({ ...time, provider_id }))
    );
    await this.repository_available_times.save(times_created);
  }

  async findById(id: string): Promise<Provider> {
    return this.repository.findOne(id);
  }

  createDay;
}
export { ProvidersRepository };
