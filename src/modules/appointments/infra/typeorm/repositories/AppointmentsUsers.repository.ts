import { getRepository, Repository } from "typeorm";

import { CreateAppointmentUsersRepositoryDTO } from "@modules/appointments/dtos";
import { AppointmentClient } from "@modules/appointments/infra/typeorm/entities/AppointmentClient";
import { AppointmentsUsersRepositoryInterface } from "@modules/appointments/repositories/AppointmentsUsers.repository.interface";

export class AppointmentsUsersRepository
  implements AppointmentsUsersRepositoryInterface {
  private repository: Repository<AppointmentClient>;

  constructor() {
    this.repository = getRepository(AppointmentClient);
  }

  async create({
    active,
    users,
    appointment_id,
  }: CreateAppointmentUsersRepositoryDTO): Promise<AppointmentClient[]> {
    return this.repository.save(
      users.map((user) => ({
        active,
        appointment_id,
        client_id: user.id,
      }))
    );
  }

  async delete(id: string) {
    await this.repository.delete(id);
  }
}
