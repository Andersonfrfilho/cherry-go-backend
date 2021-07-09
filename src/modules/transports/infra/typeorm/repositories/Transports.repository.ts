import { getRepository, Repository } from "typeorm";

import {
  CreateAppointmentsTransportsRepositoryDTO,
  CreateTransportsRepositoryDTO,
} from "@modules/transports/dtos";
import { Transport } from "@modules/transports/infra/typeorm/entities/Transport";
import { TransportsRepositoryInterface } from "@modules/transports/repositories/Transports.repository.interface";

export class TransportsRepository implements TransportsRepositoryInterface {
  private repository: Repository<Transport>;

  constructor() {
    this.repository = getRepository(Transport);
  }
  async createAppointmentsTransport({
    appointment_id,
    providers,
    origin_address_id,
  }: CreateAppointmentsTransportsRepositoryDTO): Promise<void> {
    const transports = providers.map((provider) => provider.transports);
    this.repository.save(
      transports.map((transport) => ({
        ...transport,
        appointment_id,
        origin_address_id,
      }))
    );
  }

  async create({
    amount,
    confirm,
    arrival_time_return,
    departure_time,
    destination_address_id,
    initial_hour,
    origin_address_id,
    return_time,
    transport_type_id,
    appointment_id,
    arrival_time_destination,
    provider_id,
  }: CreateTransportsRepositoryDTO): Promise<Transport> {
    return this.repository.save({
      amount,
      confirm,
      arrival_time_return,
      departure_time,
      destination_address_id,
      initial_hour,
      origin_address_id,
      return_time,
      transport_type_id,
      appointment_id,
      arrival_time_destination,
      provider_id,
    });
  }
  async findById(id: string): Promise<Transport> {
    return this.repository.findOne(id);
  }
}
