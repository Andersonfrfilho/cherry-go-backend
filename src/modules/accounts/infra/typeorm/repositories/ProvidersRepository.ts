import { getRepository, In, Repository } from "typeorm";

import {
  CreatePaymentTypesAvailableRepositoryDTO,
  CreateProviderDaysAvailabilityProviderDTO,
  CreateServiceProviderRepositoryDTO,
  CreateProviderTimesAvailabilityProviderDTO,
} from "@modules/accounts/dtos";
import { Provider } from "@modules/accounts/infra/typeorm/entities/Provider";
import { ProviderAvailabilityDay } from "@modules/accounts/infra/typeorm/entities/ProviderAvailabilityDay";
import { ProviderAvailabilityTime } from "@modules/accounts/infra/typeorm/entities/ProviderAvailabilityTime";
import { ProviderPaymentType } from "@modules/accounts/infra/typeorm/entities/ProviderPaymentType";
import { ProviderService } from "@modules/accounts/infra/typeorm/entities/ProviderService";
import { Service } from "@modules/accounts/infra/typeorm/entities/Services";
import { ProvidersRepositoryInterface } from "@modules/accounts/repositories/ProvidersRepository.interface";
import { PaymentType } from "@modules/appointments/infra/typeorm/entities/PaymentType";

class ProvidersRepository implements ProvidersRepositoryInterface {
  private repository: Repository<Provider>;
  private repository_available_days: Repository<ProviderAvailabilityDay>;
  private repository_available_times: Repository<ProviderAvailabilityTime>;
  private repository_service: Repository<Service>;
  private repository_provider_service: Repository<ProviderService>;
  private repository_payment_type: Repository<PaymentType>;
  private repository_provider_payment_type: Repository<ProviderPaymentType>;
  constructor() {
    this.repository = getRepository(Provider);
    this.repository_available_days = getRepository(ProviderAvailabilityDay);
    this.repository_available_times = getRepository(ProviderAvailabilityTime);
    this.repository_service = getRepository(Service);
    this.repository_provider_service = getRepository(ProviderService);
    this.repository_payment_type = getRepository(PaymentType);
    this.repository_provider_payment_type = getRepository(ProviderPaymentType);
  }
  async findByIdsActiveAndServices(
    providers_id: Partial<Provider>[]
  ): Promise<Provider[]> {
    return this.repository.find({
      where: { id: In(providers_id), active: true },
    });
  }

  async createPaymentTypesAvailable({
    payments_types,
    provider_id,
  }: CreatePaymentTypesAvailableRepositoryDTO): Promise<void> {
    const payments_types_found = await this.repository_payment_type.find({
      where: { name: In(payments_types), active: true },
    });

    await this.repository_provider_payment_type.save(
      payments_types_found.map((element) => ({
        payment_type_id: element.id,
        provider_id,
        active: true,
      }))
    );
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
  }: CreateProviderDaysAvailabilityProviderDTO): Promise<void> {
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
}
export { ProvidersRepository };
