import { time } from "console";
import { getRepository, Repository } from "typeorm";

import {
  CreateProviderDaysAvailabilityServiceDTO,
  CreateProviderTimesAvailabilityServiceDTO,
  CreateServiceProviderRepositoryDTO,
} from "@modules/accounts/dtos";
import { CreateProviderTimesAvailabilityProviderDTO } from "@modules/accounts/dtos/repositories/CreateProviderTimesAvailabilityProvider.dto";
import { Provider } from "@modules/accounts/infra/typeorm/entities/Provider";
import { ProviderAvailabilityDay } from "@modules/accounts/infra/typeorm/entities/ProviderAvailabilityDay";
import { ProviderAvailabilityTime } from "@modules/accounts/infra/typeorm/entities/ProviderAvailabilityTime";
import { ProviderService } from "@modules/accounts/infra/typeorm/entities/ProviderService";
import { Service } from "@modules/accounts/infra/typeorm/entities/Services";
import { ProvidersRepositoryInterface } from "@modules/accounts/repositories/ProvidersRepository.interface";

class ProvidersRepository implements ProvidersRepositoryInterface {
  private repository: Repository<Provider>;
  private repository_available_days: Repository<ProviderAvailabilityDay>;
  private repository_available_times: Repository<ProviderAvailabilityTime>;
  private repository_service: Repository<Service>;
  private repository_provider_service: Repository<ProviderService>;
  constructor() {
    this.repository = getRepository(Provider);
    this.repository_available_days = getRepository(ProviderAvailabilityDay);
    this.repository_available_times = getRepository(ProviderAvailabilityTime);
    this.repository_service = getRepository(Service);
    this.repository_provider_service = getRepository(ProviderService);
  }
  async createServiceProvider({
    provider_id,
    amount,
    name,
    duration,
  }: CreateServiceProviderRepositoryDTO): Promise<void> {
    const service = await this.repository_service.save({
      amount,
      name,
      duration,
    });

    await this.repository_provider_service.save({
      provider_id,
      service_id: service.id,
      active: true,
    });
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
