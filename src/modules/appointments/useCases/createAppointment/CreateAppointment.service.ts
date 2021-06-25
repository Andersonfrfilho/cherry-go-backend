import { inject, injectable } from "tsyringe";

import { ProvidersRepositoryInterface } from "@modules/accounts/repositories/ProvidersRepository.interface";
import { ServicesProvidersRepositoryInterface } from "@modules/accounts/repositories/ServicesProvidersRepository.interface";
import { UsersRepositoryInterface } from "@modules/accounts/repositories/UsersRepository.interface";
import { AddressesRepositoryInterface } from "@modules/addresses/repositories/AddressesRepository.interface";
import { CreateAppointmentServiceDTO } from "@modules/appointments/dtos";
import { AppointmentsAddressesRepositoryInterface } from "@modules/appointments/repositories/AppointmentsAddressesRepository.interface";
import { AppointmentsProvidersRepositoryInterface } from "@modules/appointments/repositories/AppointmentsProvidersRepository.interface";
import { AppointmentsProvidersServicesRepositoryInterface } from "@modules/appointments/repositories/AppointmentsProvidersServicesRepository.interface";
import { AppointmentsRepositoryInterface } from "@modules/appointments/repositories/AppointmentsRepository.interface";
import { AppointmentsUsersRepositoryInterface } from "@modules/appointments/repositories/AppointmentsUsersRepository.interface";
import { TransportsRepositoryInterface } from "@modules/transports/repositories/TransportsRepository.interface";
import { AppError } from "@shared/errors/AppError";
import { NOT_FOUND } from "@shared/errors/constants";

@injectable()
export class CreateAppointmentService {
  constructor(
    @inject("UsersRepository")
    private usersRepository: UsersRepositoryInterface,
    @inject("AddressesRepository")
    private addressesRepository: AddressesRepositoryInterface,
    @inject("ProvidersRepository")
    private providersRepository: ProvidersRepositoryInterface,
    @inject("AppointmentsRepository")
    private appointmentsRepository: AppointmentsRepositoryInterface,
    @inject("AppointmentsUsersRepository")
    private appointmentsUsersRepository: AppointmentsUsersRepositoryInterface,
    @inject("AppointmentsProvidersRepository")
    private appointmentsProvidersRepository: AppointmentsProvidersRepositoryInterface,
    @inject("ServicesRepository")
    private servicesProvidersRepository: ServicesProvidersRepositoryInterface,
    @inject("AppointmentsProvidersServicesRepository")
    private appointmentsProvidersServicesRepository: AppointmentsProvidersServicesRepositoryInterface,
    @inject("AppointmentsAddressesRepository")
    private appointmentsAddressesRepository: AppointmentsAddressesRepositoryInterface,
    @inject("TransportsRepository")
    private transportsRepository: TransportsRepositoryInterface
  ) {}
  async execute({
    users,
    appointment,
    providers,
    local,
    transactions,
  }: CreateAppointmentServiceDTO): Promise<void> {
    const appointment_created = await this.appointmentsRepository.create(
      appointment
    );

    const address = await this.addressesRepository.create(local);

    await this.appointmentsAddressesRepository.create({
      addresses_id: address.id,
      appointment_id: appointment_created.id,
    });

    const users_founds = await this.usersRepository.findByIdsActive(users);

    if (users_founds.length !== users.length) {
      throw new AppError(NOT_FOUND.USER_DOES_NOT_EXIST);
    }

    await this.appointmentsUsersRepository.create({
      appointment_id: appointment_created.id,
      users: users_founds,
      active: false,
    });

    const providers_founds = await this.providersRepository.findByIdsActiveAndServices(
      providers.map((provider) => provider.provider)
    );

    if (providers_founds.length !== providers.length) {
      throw new AppError(NOT_FOUND.PROVIDER_DOES_NOT_EXIST);
    }

    await this.appointmentsProvidersRepository.create({
      appointment_id: appointment_created.id,
      providers: providers_founds,
      active: false,
    });

    const services_select = providers
      .map((provider_elements) =>
        provider_elements.services.map((service) => service)
      )
      .reduce((accumulator, currentValue) => [...accumulator, ...currentValue]);

    const services_providers_found = await this.servicesProvidersRepository.findByIdsActive(
      services_select
    );

    if (services_providers_found.length !== services_select.length) {
      throw new AppError(NOT_FOUND.SERVICE_PROVIDER_DOES_NOT_EXIST);
    }

    await this.appointmentsProvidersServicesRepository.create({
      appointment_id: appointment_created.id,
      services: services_providers_found,
    });

    await this.transportsRepository.createAppointmentsTransport({
      providers,
      appointment_id: appointment.id,
      origin_address_id: address.id,
    });

    // Soma
    const value_service_totals = providers
      .map((element) => element.services.map((service) => service.amount))
      .reduce((accumulator, currentValue) => [...accumulator, ...currentValue])
      .reduce((accumulator, currentValue) => accumulator + currentValue);
    // pegar todas criações de services transport e adicionar o total aqui
    const value_transport_totals = providers
      .map((element) => element.transports.map((transport) => transport.amount))
      .reduce((accumulator, currentValue) => [...accumulator, ...currentValue])
      .reduce((accumulator, currentValue) => accumulator + currentValue);
    // pegar os descontos
    const discount_service_totals = providers
      .map((element) => element.services.map((service) => service.discount))
      .reduce((accumulator, currentValue) => [...accumulator, ...currentValue])
      .reduce((accumulator, currentValue) => accumulator + currentValue);

    const discount_transport_totals = providers
      .map((element) =>
        element.transports.map((transport) => transport.discount)
      )
      .reduce((accumulator, currentValue) => [...accumulator, ...currentValue])
      .reduce((accumulator, currentValue) => accumulator + currentValue);

    const increment_service_totals = providers
      .map((element) => element.services.map((service) => service.increment))
      .reduce((accumulator, currentValue) => [...accumulator, ...currentValue])
      .reduce((accumulator, currentValue) => accumulator + currentValue);

    const increment_transport_totals = providers
      .map((element) =>
        element.transports.map((transport) => transport.increment)
      )
      .reduce((accumulator, currentValue) => [...accumulator, ...currentValue])
      .reduce((accumulator, currentValue) => accumulator + currentValue);

    const original_amount = value_service_totals + value_transport_totals;
    const discount_amount = discount_service_totals + discount_transport_totals;
  }
}
