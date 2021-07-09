import { getRepository, Repository } from "typeorm";

import { CreateAppointmentsAddressesRepositoryDTO } from "@modules/appointments/dtos";
import { AppointmentAddress } from "@modules/appointments/infra/typeorm/entities/AppointmentAddress";
import { AppointmentsAddressesRepositoryInterface } from "@modules/appointments/repositories/AppointmentsAddresses.repository.interface";

export class AppointmentsAddressesRepository
  implements AppointmentsAddressesRepositoryInterface {
  private repository: Repository<AppointmentAddress>;

  constructor() {
    this.repository = getRepository(AppointmentAddress);
  }
  async create({
    appointment_id,
    addresses_id,
  }: CreateAppointmentsAddressesRepositoryDTO): Promise<void> {
    await this.repository.save({ appointment_id, addresses_id });
  }
}
