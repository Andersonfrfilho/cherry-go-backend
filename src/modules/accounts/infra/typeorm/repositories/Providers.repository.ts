import { getRepository, In, Repository } from "typeorm";

import {
  CreatePaymentTypesAvailableRepositoryDTO,
  CreateProviderDaysAvailabilityProviderRepositoryDTO,
  CreateServiceProviderRepositoryDTO,
  CreateProviderTimesAvailabilityProviderDTO,
  CreateAddressUsersProvidersRepositoryDTO,
  CreateTransportTypesAvailableRepositoryDTO,
} from "@modules/accounts/dtos";
import { Provider } from "@modules/accounts/infra/typeorm/entities/Provider";
import { ProviderAddress } from "@modules/accounts/infra/typeorm/entities/ProviderAddress";
import { ProviderAvailabilityDay } from "@modules/accounts/infra/typeorm/entities/ProviderAvailabilityDay";
import { ProviderAvailabilityTime } from "@modules/accounts/infra/typeorm/entities/ProviderAvailabilityTime";
import { ProviderPaymentType } from "@modules/accounts/infra/typeorm/entities/ProviderPaymentType";
import { ProviderTransportType } from "@modules/accounts/infra/typeorm/entities/ProviderTransportTypes";
import { Service } from "@modules/accounts/infra/typeorm/entities/Services";
import { ProvidersRepositoryInterface } from "@modules/accounts/repositories/Providers.repository.interface";
import { Address } from "@modules/addresses/infra/typeorm/entities/Address";
import { PaymentType } from "@modules/appointments/infra/typeorm/entities/PaymentType";
import { TransportType } from "@modules/transports/infra/typeorm/entities/TransportType";

class ProvidersRepository implements ProvidersRepositoryInterface {
  private repository: Repository<Provider>;
  private repository_available_days: Repository<ProviderAvailabilityDay>;
  private repository_available_times: Repository<ProviderAvailabilityTime>;
  private repository_service: Repository<Service>;
  private repository_payment_type: Repository<PaymentType>;
  private repository_provider_payment_type: Repository<ProviderPaymentType>;
  private repository_provider_transport_type: Repository<ProviderTransportType>;
  private repository_transport_type: Repository<TransportType>;
  private repository_addresses: Repository<Address>;
  private repository_provider_addresses: Repository<ProviderAddress>;
  constructor() {
    this.repository = getRepository(Provider);
    this.repository_available_days = getRepository(ProviderAvailabilityDay);
    this.repository_available_times = getRepository(ProviderAvailabilityTime);
    this.repository_service = getRepository(Service);
    this.repository_payment_type = getRepository(PaymentType);
    this.repository_provider_payment_type = getRepository(ProviderPaymentType);
    this.repository_provider_transport_type = getRepository(
      ProviderTransportType
    );
    this.repository_transport_type = getRepository(TransportType);
    this.repository_addresses = getRepository(Address);
    this.repository_provider_addresses = getRepository(ProviderAddress);
  }

  async createAddressProviders({
    zipcode,
    street,
    state,
    number,
    longitude,
    latitude,
    district,
    country,
    city,
    provider_id,
  }: CreateAddressUsersProvidersRepositoryDTO): Promise<void> {
    const { id } = await this.repository_addresses.save({
      zipcode,
      street,
      state,
      number,
      longitude,
      latitude,
      district,
      country,
      city,
    });

    await this.repository_provider_addresses.save({
      address_id: id,
      provider_id,
    });
  }

  async createTransportTypesAvailable({
    provider_id,
    transport_types,
  }: CreateTransportTypesAvailableRepositoryDTO): Promise<void> {
    const transport_types_found = await this.repository_transport_type.find({
      where: {
        name: In(transport_types.map((transport_type) => transport_type.name)),
        active: true,
      },
    });

    await this.repository_provider_transport_type.save(
      transport_types_found.map((transport_type, index) => ({
        provider_id,
        transport_type_id: transport_type.id,
        active: true,
        amount: transport_types[index].amount,
      }))
    );
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
    active,
  }: CreateServiceProviderRepositoryDTO): Promise<void> {
    await this.repository_service.save({
      provider_id,
      amount,
      name,
      duration,
      active,
    });
  }

  async findByEmail(email: string): Promise<Provider> {
    return this.repository.findOne({ email });
  }

  async createDaysAvailable({
    days,
    provider_id,
  }: CreateProviderDaysAvailabilityProviderRepositoryDTO): Promise<void> {
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
