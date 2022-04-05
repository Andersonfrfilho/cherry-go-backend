import { getManager, getRepository, Repository } from "typeorm";

import { CreateAppointmentRepositoryDTO } from "@modules/appointments/dtos";
import { TransactionCreateAppointmentRepositoryDTO } from "@modules/appointments/dtos/repositories/TransactionCreateAppointment.repository.dto";
import { STATUS_PROVIDERS_APPOINTMENT_ENUM } from "@modules/appointments/enums/StatusProvidersAppointment.enum";
import { Appointment } from "@modules/appointments/infra/typeorm/entities/Appointment";
import { AppointmentClient } from "@modules/appointments/infra/typeorm/entities/AppointmentClient";
import { AppointmentProvider } from "@modules/appointments/infra/typeorm/entities/AppointmentProvider";
import { AppointmentsRepositoryInterface } from "@modules/appointments/repositories/Appointments.repository.interface";
import {
  ITENS_TYPES_TRANSACTIONS_ENUM,
  STATUS_EVENTS_TRANSACTIONS_ENUM,
} from "@modules/transactions/enums";
import { Transaction } from "@modules/transactions/infra/typeorm/entities/Transaction";
import { TransactionEvent } from "@modules/transactions/infra/typeorm/entities/TransactionEvent";
import { TransactionItem } from "@modules/transactions/infra/typeorm/entities/TransactionItem";
import { Transport } from "@modules/transports/infra/typeorm/entities/Transport";

import { AppointmentAddress } from "../entities/AppointmentAddress";
import { AppointmentLocalType } from "../entities/AppointmentLocalType";
import { AppointmentProviderService } from "../entities/AppointmentsProviderService";

export class AppointmentsRepository implements AppointmentsRepositoryInterface {
  private repository: Repository<Appointment>;
  private repository_appointment_client: Repository<AppointmentClient>;
  private repository_appointment_provider: Repository<AppointmentProvider>;
  private repository_transaction: Repository<Transaction>;
  private repository_transaction_item: Repository<TransactionItem>;
  private repository_transaction_event: Repository<TransactionEvent>;
  private repository_transport: Repository<Transport>;
  private repository_appointment_address: Repository<AppointmentAddress>;
  private repository_local_type: Repository<AppointmentLocalType>;
  private repository_appointment_provider_service: Repository<AppointmentProviderService>;

  constructor() {
    this.repository = getRepository(Appointment);
    this.repository_appointment_client = getRepository(AppointmentClient);
    this.repository_appointment_provider = getRepository(AppointmentProvider);
    this.repository_transaction = getRepository(Transaction);
    this.repository_transaction_item = getRepository(TransactionItem);
    this.repository_transaction_event = getRepository(TransactionEvent);
    this.repository_appointment_address = getRepository(AppointmentAddress);
    this.repository_transport = getRepository(Transport);
    this.repository_local_type = getRepository(AppointmentLocalType);
    this.repository_appointment_provider_service = getRepository(
      AppointmentProviderService
    );
  }

  async findById(id: string): Promise<Appointment> {
    const appointment = await this.repository.findOne(id);
    return appointment;
  }

  async delete(id: string): Promise<void> {
    await this.repository.delete(id);
  }

  async create({
    confirm,
    initial_date,
    final_date,
  }: CreateAppointmentRepositoryDTO): Promise<Appointment> {
    return this.repository.save({
      confirm,
      initial_date,
      final_date,
    });
  }

  async transactionCreate({
    confirm,
    initial_date,
    final_date,
    client_id,
    provider_id,
    current_amount,
    discount_amount,
    increment_amount,
    original_amount,
    services,
    address,
    transport_type,
    payment_type,
    duration_total,
    local_type,
  }: TransactionCreateAppointmentRepositoryDTO): Promise<Appointment> {
    return getManager().transaction(async (transactionalEntityManager) => {
      const appointment_entity = this.repository.create({
        confirm,
        initial_date,
        final_date,
        duration: duration_total,
      });

      const appointment = await transactionalEntityManager.save(
        appointment_entity
      );
      const { id: appointment_id } = appointment;

      const appointment_client_entity =
        this.repository_appointment_client.create({
          active: true,
          client_id,
          appointment_id,
        });

      await transactionalEntityManager.save(appointment_client_entity);
      const appointment_provider_entity =
        this.repository_appointment_provider.create({
          provider_id,
          status: STATUS_PROVIDERS_APPOINTMENT_ENUM.OPEN,
          appointment_id,
        });

      await transactionalEntityManager.save(appointment_provider_entity);
      const transaction_entity = this.repository_transaction.create({
        appointment_id,
        client_id,
        current_amount,
        discount_amount,
        increment_amount,
        original_amount,
        status: STATUS_PROVIDERS_APPOINTMENT_ENUM.OPEN,
      });

      const { id: transaction_id } = await transactionalEntityManager.save(
        transaction_entity
      );

      const items: TransactionItem[] = [
        ...services.map((service) => {
          return {
            transaction_id,
            elements: service,
            reference_key: service.id,
            type: ITENS_TYPES_TRANSACTIONS_ENUM.SERVICE,
            increment_amount: 0,
            discount_amount: 0,
            amount: service.amount,
          };
        }),
        {
          transaction_id,
          elements: address,
          reference_key: address.id,
          type: ITENS_TYPES_TRANSACTIONS_ENUM.LOCAL,
          increment_amount: 0,
          discount_amount: 0,
          amount: Number(address.amount.toString()),
        },
        {
          transaction_id,
          elements: transport_type,
          reference_key: transport_type.id,
          type: ITENS_TYPES_TRANSACTIONS_ENUM.TRANSPORT,
          increment_amount: 0,
          discount_amount: 0,
          amount: Number(transport_type.amount),
        },
      ];

      const transaction_itens_entities =
        this.repository_transaction_item.create(items);

      await transactionalEntityManager.save(transaction_itens_entities);
      const appointment_address_entity =
        this.repository_appointment_address.create({
          address_id: address.address.id,
          appointment_id,
          amount: Number(address.amount),
        });

      await transactionalEntityManager.save(appointment_address_entity);
      const transaction_event_entity = this.repository_transaction_event.create(
        {
          amount: current_amount,
          payment_type_id: payment_type.payment_type_id,
          status: STATUS_EVENTS_TRANSACTIONS_ENUM.CREATE,
          transaction_id,
        }
      );

      await transactionalEntityManager.save(transaction_event_entity);
      const transport_entity = this.repository_transport.create({
        amount: transport_type.amount,
        appointment_id,
        origin_address_id: address.details.local_initial.id,
        destination_address_id: address.details.local_destination.id,
        initial_hour: initial_date,
        transport_type_id: transport_type.transport_type_id,
        provider_id,
        return_time: final_date,
        confirm: false,
        arrival_time_destination: null,
        arrival_time_return: null,
      });

      await transactionalEntityManager.save(transport_entity);

      const appointment_local_type_entity = this.repository_local_type.create({
        appointment_id,
        local_type,
      });

      await transactionalEntityManager.save(appointment_local_type_entity);

      const appointment_provider_service_entity = services.map((service) => {
        return this.repository_appointment_provider_service.create({
          appointment_id,
          provider_id: service.provider_id,
          service_id: service.id,
        });
      });

      await transactionalEntityManager.save(
        appointment_provider_service_entity
      );

      return appointment;
    });
  }
}
