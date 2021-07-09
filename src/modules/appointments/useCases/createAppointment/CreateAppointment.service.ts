import { inject, injectable } from "tsyringe";

import { ProvidersRepositoryInterface } from "@modules/accounts/repositories/Providers.repository.interface";
import { ServicesProvidersRepositoryInterface } from "@modules/accounts/repositories/ServicesProviders.repository.interface";
import { UsersRepositoryInterface } from "@modules/accounts/repositories/Users.repository.interface";
import { AddressesRepositoryInterface } from "@modules/addresses/repositories/Addresses.repository.interface";
import { CreateAppointmentServiceDTO } from "@modules/appointments/dtos";
import { AppointmentsRepositoryInterface } from "@modules/appointments/repositories/Appointments.repository.interface";
import { AppointmentsAddressesRepositoryInterface } from "@modules/appointments/repositories/AppointmentsAddresses.repository.interface";
import { AppointmentsProvidersRepositoryInterface } from "@modules/appointments/repositories/AppointmentsProviders.repository.interface";
import { AppointmentsProvidersServicesRepositoryInterface } from "@modules/appointments/repositories/AppointmentsProvidersServices.repository.interface";
import { AppointmentsUsersRepositoryInterface } from "@modules/appointments/repositories/AppointmentsUsers.repository.interface";
import { AppointmentsUsersTransactionsRepositoryInterface } from "@modules/appointments/repositories/AppointmentsUsersTransactions.repository.interface";
import { AppointmentTransactionsItensRepositoryInterface } from "@modules/appointments/repositories/AppointmentTransactionsItens.repository.interface";
import { ITENS_TYPES_TRANSACTIONS_ENUM } from "@modules/transactions/enums/ItensTypesTransactions.enum";
import { STATUS_TRANSACTION_ENUM } from "@modules/transactions/enums/StatusTransactionsEvents.enums";
import { TransportsRepositoryInterface } from "@modules/transports/repositories/Transports.repository.interface";
import { AppError } from "@shared/errors/AppError";
import { BAD_REQUEST, NOT_FOUND } from "@shared/errors/constants";

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
    private transportsRepository: TransportsRepositoryInterface,
    @inject("AppointmentsUsersTransactionsRepository")
    private appointmentsUsersTransactionsRepository: AppointmentsUsersTransactionsRepositoryInterface,
    @inject("AppointmentTransactionsItensRepository")
    private appointmentTransactionsItensRepository: AppointmentTransactionsItensRepositoryInterface
  ) {}
  async execute({
    users,
    appointment,
    providers,
    local,
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
      appointment_id: appointment_created.id,
      origin_address_id: address.id,
    });

    const transaction = await this.appointmentsUsersTransactionsRepository.createAppointmentsUsersTransactions(
      {
        appointment_id: appointment_created.id,
        user_id: users_founds[0].id,
        status: STATUS_TRANSACTION_ENUM.PROGRESS,
      }
    );

    // Soma
    const service_itens = providers
      .map((provider) =>
        provider.services.map((service) => ({
          transaction_id: transaction.id,
          elements: service,
          reference_key: service.id,
          type: ITENS_TYPES_TRANSACTIONS_ENUM.SERVICE,
          increment_amount: service.increment_amount,
          discount_amount: service.discount_amount,
          amount: service.amount,
        }))
      )
      .reduce((accumulator, currentValue) => [...accumulator, ...currentValue]);

    const transport_itens = providers
      .map((provider) =>
        provider.transports.map((transport) => ({
          transaction_id: transaction.id,
          elements: transport,
          reference_key: transport.id,
          type: ITENS_TYPES_TRANSACTIONS_ENUM.TRANSPORT,
          increment_amount: transport.increment_amount,
          discount_amount: transport.discount_amount,
          amount: transport.amount,
        }))
      )
      .reduce((accumulator, currentValue) => [...accumulator, ...currentValue]);

    const itens_transactions = [...service_itens, ...transport_itens];

    await this.appointmentTransactionsItensRepository.createAppointmentsTransactionsItens(
      itens_transactions
    );

    const amount_services_totals = providers
      .map((provider) => provider.services.map((service) => service.amount))
      .reduce((accumulator, currentValue) => [...accumulator, ...currentValue])
      .reduce((accumulator, currentValue) => accumulator + currentValue);

    const amount_transports_totals = providers
      .map((provider) =>
        provider.transports.map((transport) => transport.amount)
      )
      .reduce((accumulator, currentValue) => [...accumulator, ...currentValue])
      .reduce((accumulator, currentValue) => accumulator + currentValue);
    // pegar os descontos
    const discount_service_totals = providers
      .map((provider) =>
        provider.services.map((service) => service.discount_amount)
      )
      .reduce((accumulator, currentValue) => [...accumulator, ...currentValue])
      .reduce((accumulator, currentValue) => accumulator + currentValue);

    const discount_transport_totals = providers
      .map((provider) =>
        provider.transports.map((transport) => transport.discount_amount)
      )
      .reduce((accumulator, currentValue) => [...accumulator, ...currentValue])
      .reduce((accumulator, currentValue) => accumulator + currentValue);

    const increment_service_totals = providers
      .map((provider) =>
        provider.services.map((service) => service.increment_amount)
      )
      .reduce((accumulator, currentValue) => [...accumulator, ...currentValue])
      .reduce((accumulator, currentValue) => accumulator + currentValue);

    const increment_transport_totals = providers
      .map((provider) =>
        provider.transports.map((transport) => transport.increment_amount)
      )
      .reduce((accumulator, currentValue) => [...accumulator, ...currentValue])
      .reduce((accumulator, currentValue) => accumulator + currentValue);

    const original_amount = amount_services_totals + amount_transports_totals;
    const discount_amount = discount_service_totals + discount_transport_totals;
    const increment_amount =
      increment_service_totals + increment_transport_totals;
    const current_amount = original_amount + increment_amount - discount_amount;
    if (current_amount < 0) {
      throw new AppError(BAD_REQUEST.TRANSACTION_INVALID);
    }
    await this.appointmentsUsersTransactionsRepository.updatedAppointmentsUsersTransactions(
      {
        current_amount,
        discount_amount,
        increment_amount,
        original_amount,
        transaction_id: transaction.id,
      }
    );
  }
}
