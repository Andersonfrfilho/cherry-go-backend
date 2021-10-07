import { classToClass } from "class-transformer";
import { getRepository, In, Repository } from "typeorm";

import {
  CreatePaymentTypesAvailableRepositoryDTO,
  CreateProviderDaysAvailabilityProviderRepositoryDTO,
  CreateServiceProviderRepositoryDTO,
  CreateProviderTimesAvailabilityProviderDTO,
  CreateAddressUsersProvidersRepositoryDTO,
  CreateTransportTypesAvailableRepositoryDTO,
} from "@modules/accounts/dtos";
import { CreateUserProviderRepositoryDTO } from "@modules/accounts/dtos/repositories/CreateUserProviderType.repository.dto";
import {
  PaginationPropsGenericDTO,
  PaginationResponseAppointmentsDTO,
  PaginationResponsePropsDTO,
} from "@modules/accounts/dtos/repositories/PaginationProps.dto";
import { USER_TYPES_ENUM } from "@modules/accounts/enums/UserTypes.enum";
import { Provider } from "@modules/accounts/infra/typeorm/entities/Provider";
import { ProviderAddress } from "@modules/accounts/infra/typeorm/entities/ProviderAddress";
import { ProviderAvailabilityDay } from "@modules/accounts/infra/typeorm/entities/ProviderAvailabilityDay";
import { ProviderAvailabilityTime } from "@modules/accounts/infra/typeorm/entities/ProviderAvailabilityTime";
import { ProviderPaymentType } from "@modules/accounts/infra/typeorm/entities/ProviderPaymentType";
import { ProviderTransportType } from "@modules/accounts/infra/typeorm/entities/ProviderTransportTypes";
import { Service } from "@modules/accounts/infra/typeorm/entities/Services";
import { ProvidersRepositoryInterface } from "@modules/accounts/repositories/Providers.repository.interface";
import { Address } from "@modules/addresses/infra/typeorm/entities/Address";
import { STATUS_PROVIDERS_APPOINTMENT } from "@modules/appointments/enums/StatusProvidersAppointment.enum";
import { Appointment } from "@modules/appointments/infra/typeorm/entities/Appointment";
import { AppointmentProvider } from "@modules/appointments/infra/typeorm/entities/AppointmentProviders";
import { PaymentType } from "@modules/appointments/infra/typeorm/entities/PaymentType";
import { TransportType } from "@modules/transports/infra/typeorm/entities/TransportType";

import { TypeUser } from "../entities/TypeUser";
import { UserTermsAccept } from "../entities/UserTermsAccept";
import { UserTypeUser } from "../entities/UserTypeUser";

interface CustomAppointmentFound {
  provider_id: string;
}
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
  private repository_users_types: Repository<TypeUser>;
  private repository_users_types_users: Repository<UserTypeUser>;
  private repository_users_terms_accepts: Repository<UserTermsAccept>;
  private repository_appointments: Repository<Appointment>;
  private repository_appointments_providers: Repository<AppointmentProvider>;

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
    this.repository_users_types = getRepository(TypeUser);
    this.repository_users_types_users = getRepository(UserTypeUser);
    this.repository_users_terms_accepts = getRepository(UserTermsAccept);
    this.repository_appointments = getRepository(Appointment);
    this.repository_appointments_providers = getRepository(AppointmentProvider);
  }

  async findAppointments({
    created_date,
    provider_id,
  }: PaginationPropsGenericDTO<Appointment>): Promise<
    PaginationResponseAppointmentsDTO<Appointment>
  > {
    const providerQuery = this.repository_appointments.createQueryBuilder(
      "foundAppointment"
    );

    if (created_date) {
      providerQuery.andWhere("foundAppointment.created_at > :created_date", {
        created_date,
      });
    }

    providerQuery
      .leftJoinAndSelect("foundAppointment.providers", "providers")
      .andWhere("providers.provider_id = :provider_id", { provider_id })
      .leftJoinAndSelect("foundAppointment.clients", "clients")
      .leftJoinAndSelect("clients.client", "client")
      .leftJoinAndSelect("client.image_profile", "image_profile")
      .leftJoinAndSelect("image_profile.image", "image")
      .leftJoinAndSelect("foundAppointment.transports", "transports")
      .leftJoinAndSelect("transports.transport_type", "type")
      .leftJoinAndSelect("transports.origin_address", "origin")
      .leftJoinAndSelect("transports.destination_address", "destination")
      .leftJoinAndSelect("foundAppointment.addresses", "addresses")
      .leftJoinAndSelect("addresses.address", "address")
      .leftJoinAndSelect("foundAppointment.transactions", "transactions")
      .leftJoinAndSelect("transactions.itens", "itens");

    const [results, total] = await providerQuery
      .orderBy("foundAppointment.initial_date", "DESC")
      .getManyAndCount();
    const appointment_open = results.filter(
      (appointment) =>
        appointment.providers[0].status === STATUS_PROVIDERS_APPOINTMENT.OPEN
    );
    const appointment_rejected = results.filter(
      (appointment) =>
        appointment.providers[0].status ===
        STATUS_PROVIDERS_APPOINTMENT.REJECTED
    );
    const appointment_accepted = results.filter(
      (appointment) =>
        appointment.providers[0].status ===
        STATUS_PROVIDERS_APPOINTMENT.ACCEPTED
    );
    return {
      results: {
        opens: classToClass(appointment_open),
        rejected: classToClass(appointment_rejected),
        confirmed: classToClass(appointment_accepted),
      },
      total,
    };
  }

  async createUserProviderType({
    birth_date,
    cpf,
    email,
    gender,
    last_name,
    name,
    password,
    rg,
    term,
    term_provider,
    active,
    details,
  }: CreateUserProviderRepositoryDTO): Promise<Provider> {
    const types = await this.repository_users_types.find({
      where: [
        { name: USER_TYPES_ENUM.CLIENT },
        { name: USER_TYPES_ENUM.PROVIDER },
      ],
    });

    const user = await this.repository.save({
      name,
      last_name,
      email,
      cpf,
      rg,
      gender,
      details,
      birth_date,
      password_hash: password,
      active,
    });

    const users_types = this.repository_users_types_users.create(
      types.map((type) => ({
        user_id: user.id,
        user_type_id: type.id,
        active: true,
      }))
    );

    await this.repository_users_types_users.save(users_types);

    const term_accept = this.repository_users_terms_accepts.create([
      {
        accept: term,
        user_id: user.id,
        type: USER_TYPES_ENUM.CLIENT,
      },
      {
        accept: term_provider,
        user_id: user.id,
        type: USER_TYPES_ENUM.PROVIDER,
      },
    ]);

    await this.repository_users_terms_accepts.save(term_accept);

    return this.repository.create(user);
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
