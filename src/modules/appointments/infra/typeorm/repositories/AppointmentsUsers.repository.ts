import { getRepository, Repository } from "typeorm";

import { CreateAppointmentUsersRepositoryDTO } from "@modules/appointments/dtos";
import { AppointmentUser } from "@modules/appointments/infra/typeorm/entities/AppointmentUser";
import { AppointmentsUsersRepositoryInterface } from "@modules/appointments/repositories/AppointmentsUsers.repository.interface";

export class AppointmentsUsersRepository
  implements AppointmentsUsersRepositoryInterface {
  private repository: Repository<AppointmentUser>;

  constructor() {
    this.repository = getRepository(AppointmentUser);
  }

  async create({
    active,
    users,
    appointment_id,
  }: CreateAppointmentUsersRepositoryDTO): Promise<AppointmentUser[]> {
    return this.repository.save(
      users.map((user) => ({
        active,
        appointment_id,
        user_id: user.id,
      }))
    );
  }
  async delete(id: string) {
    await this.repository.delete(id);
  }
}
