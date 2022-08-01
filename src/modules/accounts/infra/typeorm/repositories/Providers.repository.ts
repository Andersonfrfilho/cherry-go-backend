import { instanceToInstance } from "class-transformer";
import { getRepository, In, Repository } from "typeorm";

import { config } from "@config/environment";
import { RELATIONS_PROVIDER_DEFAULT } from "@modules/accounts/constants/relationsProviderDefault.const";
import {
  CreatePaymentTypesAvailableRepositoryDTO,
  CreateProviderDaysAvailabilityProviderRepositoryDTO,
  CreateServiceProviderRepositoryDTO,
  CreateProviderTimesAvailabilityProviderDTO,
  CreateAddressUsersProvidersRepositoryDTO,
  CreateTransportTypesAvailableRepositoryDTO,
} from "@modules/accounts/dtos";
import { CreateProviderAddressRepositoryDTO } from "@modules/accounts/dtos/repositories/CreateProviderAddressRepository.dto";
import { CreateProviderLocalProviderAddressDTO } from "@modules/accounts/dtos/repositories/CreateProviderLocalProviderAddress.dto";
import { CreateProviderLocalsTypesRepositoryDTO } from "@modules/accounts/dtos/repositories/CreateProviderLocalsTypesRepository.dto";
import { CreateUserProviderRepositoryDTO } from "@modules/accounts/dtos/repositories/CreateUserProviderType.repository.dto";
import { DeleteAllDaysProviderAvailableRepositoryDTO } from "@modules/accounts/dtos/repositories/DeleteAllDaysProviderAvailableRepository.dto";
import { DeleteProviderLocalsTypesRepositoryDTO } from "@modules/accounts/dtos/repositories/DeleteProviderLocalsTypesRepository.dto";
import { FindByAreaRepositoryDTO } from "@modules/accounts/dtos/repositories/FindByArea.dto";
import { FindByIdProviderRepositoryDTO } from "@modules/accounts/dtos/repositories/FindByIdProviderRepository.dto";
import { GetAllByActiveProviderTransportTypeRepositoryDTO } from "@modules/accounts/dtos/repositories/GetAllByActiveProviderTransportTypeRepository.dto";
import {
  PaginationPropsGenericDTO,
  PaginationResponseAppointmentsDTO,
  PaginationResponsePropsDTO,
} from "@modules/accounts/dtos/repositories/PaginationProps.dto";
import { UpdateTransportTypeAvailableRepositoryDTO } from "@modules/accounts/dtos/repositories/UpdateTransportTypeAvailableRepository.dto";
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
import { STATUS_PROVIDERS_APPOINTMENT_ENUM } from "@modules/appointments/enums/StatusProvidersAppointment.enum";
import { Appointment } from "@modules/appointments/infra/typeorm/entities/Appointment";
import { AppointmentProvider } from "@modules/appointments/infra/typeorm/entities/AppointmentProvider";
import { PaymentType } from "@modules/appointments/infra/typeorm/entities/PaymentType";
import { CreateProviderTransportTypesDTO } from "@modules/transports/dtos/repositories/CreateProviderTransportTypes.repository.dto";
import { TransportType } from "@modules/transports/infra/typeorm/entities/TransportType";
import { distanceRadiusCalculation } from "@utils/distanceByRadius";

import { ProviderLocalType } from "../entities/ProviderLocalType";
import { TypeUser } from "../entities/TypeUser";
import { UserTermsAccept } from "../entities/UserTermsAccept";
import { UserTypeUser } from "../entities/UserTypeUser";

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
  private repository_provider_local_type: Repository<ProviderLocalType>;

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
    this.repository_provider_local_type = getRepository(ProviderLocalType);
  }
  async findByIds(ids: string[]): Promise<Provider[]> {
    return this.repository.findByIds(ids);
  }

  async findByArea({
    city,
    latitude,
    longitude,
    distance,
    user_id,
  }: FindByAreaRepositoryDTO): Promise<Provider[]> {
    const providersQuery = this.repository
      .createQueryBuilder("foundProviders")
      .andWhere("foundProviders.id <> :user_id", { user_id })
      .andWhere("foundProviders.cpf <> :admin_user_cpf", {
        admin_user_cpf: config.application.user.admin.cpf,
      })
      .andWhere("foundProviders.active = :active", { active: true })
      .leftJoinAndSelect("foundProviders.addresses", "addresses");

    if (city) {
      providersQuery.andWhere("addresses.city like :city", {
        city: city.toLowerCase(),
      });
    }

    const providersFound = await providersQuery
      .leftJoinAndSelect("foundProviders.locals_types", "locals_types")
      .leftJoinAndSelect("foundProviders.transports_types", "transports_types")
      .leftJoinAndSelect("transports_types.transport_type", "transport_type")
      .andWhere("transport_type.active = :active", { active: true })
      .leftJoinAndSelect("foundProviders.services", "services")
      .andWhere("services.active = :active", { active: true })
      .leftJoinAndSelect("foundProviders.ratings", "ratings")
      .leftJoinAndSelect("foundProviders.days", "days")
      .leftJoinAndSelect("foundProviders.hours", "hours")
      .leftJoinAndSelect("foundProviders.locals", "locals")
      .andWhere("locals.active = :active", { active: true })
      .leftJoinAndSelect("locals.address", "address")
      .leftJoinAndSelect("foundProviders.payments_types", "payments_types")
      .leftJoinAndSelect("payments_types.payment_type", "payment_type")
      .andWhere("payment_type.active = :active", { active: true })
      .leftJoinAndSelect("foundProviders.image_profile", "image_profile")
      .leftJoinAndSelect("foundProviders.images", "images")
      .leftJoinAndSelect("images.image", "image")
      .getMany();

    let providers_by_address = providersFound.filter(
      (provider) =>
        provider.locals_types.length > 0 &&
        provider.transports_types.length > 0 &&
        provider.services.length > 0 &&
        provider.locals.length > 0 &&
        provider.payments_types.length > 0
    );
    // order
    // price
    // filters
    // days
    // hours
    // tags
    // ratings
    // address by latitude and longitude
    if (!!latitude && !!longitude && !!distance) {
      providers_by_address = providers_by_address.filter(
        (provider) =>
          provider.addresses[0].latitude &&
          provider.addresses[0].longitude &&
          distanceRadiusCalculation({
            distance: Number(distance),
            latitude: Number(provider.addresses[0].latitude),
            longitude: Number(provider.addresses[0].longitude),
            currentLatitude: Number(latitude),
            currentLongitude: Number(longitude),
          })
      );
    }

    // locals
    let providers_by_locals = providersFound;
    providers_by_locals = providers_by_locals.filter(
      (provider) =>
        provider.locals &&
        provider.locals.length > 0 &&
        provider.locals.some(
          (local) =>
            local.address.latitude &&
            local.address.longitude &&
            distanceRadiusCalculation({
              distance: Number(distance),
              latitude: Number(local.address.latitude),
              longitude: Number(local.address.longitude),
              currentLatitude: Number(latitude),
              currentLongitude: Number(longitude),
            })
        )
    );

    const providers_available_by_address = providers_by_address.filter(
      (provider_by_address) =>
        !providers_by_locals.some(
          (provider_local) => provider_local.id === provider_by_address.id
        )
    );

    return [...providers_available_by_address, ...providers_by_locals];
  }

  async deleteServiceProvider(service_id: string): Promise<void> {
    await this.repository_service.delete(service_id);
  }

  getAllByActiveProviderTransportType(
    data: GetAllByActiveProviderTransportTypeRepositoryDTO
  ): Promise<ProviderTransportType[]> {
    throw new Error("Method not implemented.");
  }
  async updateTransportTypesAvailable({
    amount,
    transport_type_provider_id,
    details,
  }: UpdateTransportTypeAvailableRepositoryDTO): Promise<void> {
    await this.repository_provider_transport_type.update(
      transport_type_provider_id,
      { amount, details }
    );
  }
  async createProviderTransportType({
    amount,
    transport_type_id,
    provider_id,
    active,
  }: CreateProviderTransportTypesDTO): Promise<ProviderTransportType[]> {
    await this.repository_provider_transport_type.save({
      amount,
      transport_type_id,
      provider_id,
      active,
    });

    const provider_transport_types =
      this.repository_provider_transport_type.find({
        where: { provider_id },
      });

    return provider_transport_types;
  }

  async deleteProviderTransportType(
    provider_transport_type_ids: string[]
  ): Promise<void> {
    await this.repository_transport_type.delete(provider_transport_type_ids);
  }

  async getAllActiveProviderTransportType({
    active,
    provider_id,
  }: GetAllByActiveProviderTransportTypeRepositoryDTO): Promise<
    ProviderTransportType[]
  > {
    const provider_transport_types =
      this.repository_provider_transport_type.find({
        where: { active, provider_id },
      });

    return provider_transport_types;
  }

  async createProviderLocals(
    data: CreateProviderLocalProviderAddressDTO
  ): Promise<void> {
    await this.repository_provider_addresses.save(data);
  }

  async getProviderLocals(provider_id: string): Promise<ProviderAddress[]> {
    return this.repository_provider_addresses.find({ where: { provider_id } });
  }

  async deleteProviderLocals(ids: string[]): Promise<void> {
    await this.repository_provider_addresses.delete(ids);
  }

  async deleteProviderLocalsTypes({
    provider_locals_types_ids,
  }: DeleteProviderLocalsTypesRepositoryDTO): Promise<void> {
    await this.repository_provider_local_type.delete(provider_locals_types_ids);
  }

  async createProviderLocalsTypes({
    locals_types,
    provider_id,
  }: CreateProviderLocalsTypesRepositoryDTO): Promise<ProviderLocalType[]> {
    const locals = locals_types.map((local_type) =>
      this.repository_provider_local_type.create({
        active: true,
        provider_id,
        local_type,
      })
    );
    await this.repository_provider_local_type.save(locals);

    return locals;
  }
  async deleteProviderAddress(ids: string[]): Promise<void> {
    await this.repository_provider_addresses.delete(ids);
  }

  async createProviderAddress({
    provider_id,
    address_id,
    amount,
    active,
  }: CreateProviderAddressRepositoryDTO): Promise<void> {
    await this.repository_provider_addresses.save({
      provider_id,
      address_id,
      amount,
      active,
    });
  }

  async getAllAddressByProviders(id: string): Promise<ProviderAddress[]> {
    return this.repository_provider_addresses.find({
      where: { provider_id: id },
    });
  }

  async getAllPaymentTypes(id: string): Promise<ProviderPaymentType[]> {
    return this.repository_provider_payment_type.find({
      where: { provider_id: id },
    });
  }

  async deletePaymentTypes(data: string[]): Promise<void> {
    await this.repository_provider_payment_type.delete(data);
  }
  async updateProviderHourAvailable(
    data: ProviderAvailabilityTime
  ): Promise<void> {
    await this.repository_available_times.update(data.id, data);
  }
  async excludeProviderHourAvailable(provider_id: string): Promise<void> {
    await this.repository_available_times.delete(provider_id);
  }

  async findByProviderHoursAvailable(
    provider_id: string
  ): Promise<ProviderAvailabilityTime[]> {
    const hours = await this.repository_available_times.find({
      where: { provider_id },
      order: { start_time: "ASC" },
    });

    return hours;
  }

  async findAppointments({
    created_date,
    provider_id,
  }: PaginationPropsGenericDTO<Appointment>): Promise<
    PaginationResponseAppointmentsDTO<Appointment>
  > {
    const providerQuery =
      this.repository_appointments.createQueryBuilder("foundAppointment");

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
      .leftJoinAndSelect("transactions.itens", "itens")
      .leftJoinAndSelect("foundAppointment.services", "services")
      .leftJoinAndSelect("services.service", "service");

    if (created_date) {
      providerQuery.andWhere("foundAppointment.initial_date >= :initial_date", {
        initial_date: created_date,
      });
    }
    const [results, total] = await providerQuery
      .orderBy("foundAppointment.initial_date", "DESC")
      .getManyAndCount();
    const appointment_open = results.filter(
      (appointment) =>
        appointment.providers[0].status ===
        STATUS_PROVIDERS_APPOINTMENT_ENUM.OPEN
    );
    const appointment_rejected = results.filter(
      (appointment) =>
        appointment.providers[0].status ===
        STATUS_PROVIDERS_APPOINTMENT_ENUM.REJECTED
    );
    const appointment_accepted = results.filter(
      (appointment) =>
        appointment.providers[0].status ===
        STATUS_PROVIDERS_APPOINTMENT_ENUM.ACCEPTED
    );
    return {
      results: {
        opens: instanceToInstance(appointment_open),
        rejected: instanceToInstance(appointment_rejected),
        confirmed: instanceToInstance(appointment_accepted),
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
    transports_types,
  }: CreateTransportTypesAvailableRepositoryDTO): Promise<void> {
    await this.repository_provider_transport_type.save(
      transports_types.map((transport_type) => ({
        provider_id,
        transport_type_id: transport_type.transport_type_id,
        active: true,
        amount: transport_type.amount,
        details: transport_type?.details,
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

  async createPaymentTypesAvailable(
    providers_payment_types: CreatePaymentTypesAvailableRepositoryDTO[]
  ): Promise<void> {
    await this.repository_provider_payment_type.save(providers_payment_types);
  }

  async createServiceProvider({
    provider_id,
    amount,
    name,
    duration,
    active,
    details,
  }: CreateServiceProviderRepositoryDTO): Promise<Service> {
    const service = await this.repository_service.save({
      provider_id,
      amount,
      name,
      duration,
      active,
      details,
    });
    return service;
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

  async deleteAllDaysProviderAvailable({
    provider_id,
  }: DeleteAllDaysProviderAvailableRepositoryDTO): Promise<void> {
    const days_selects = await this.repository_available_days.find({
      where: {
        provider_id,
      },
    });
    if (days_selects.length > 0) {
      await this.repository_available_days.delete(
        days_selects.map((day) => day.id)
      );
    }
  }

  async createTimesAvailable({
    provider_id,
    end_hour,
    start_hour,
  }: CreateProviderTimesAvailabilityProviderDTO): Promise<void> {
    const times_created = this.repository_available_times.create({
      provider_id,
      start_time: start_hour,
      end_time: end_hour,
    });

    await this.repository_available_times.save(times_created);
  }

  async findById({
    id,
    relations = RELATIONS_PROVIDER_DEFAULT,
  }: FindByIdProviderRepositoryDTO): Promise<Provider> {
    return this.repository.findOne(id, {
      relations,
    });
  }
}
export { ProvidersRepository };
