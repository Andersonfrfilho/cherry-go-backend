import { getRepository, Repository } from "typeorm";

import { CreateAppointmentRepositoryDTO } from "@modules/appointments/dtos";
import { Appointment } from "@modules/appointments/infra/typeorm/entities/Appointment";
import { AppointmentsRepositoryInterface } from "@modules/appointments/repositories/Appointments.repository.interface";

export class AppointmentsRepository implements AppointmentsRepositoryInterface {
  private repository: Repository<Appointment>;

  constructor() {
    this.repository = getRepository(Appointment);
  }
  async delete(id: string): Promise<void> {
    await this.repository.delete(id);
  }

  async create({
    confirm,
    initial_date,
    final_date,
  }: CreateAppointmentRepositoryDTO): Promise<Appointment> {
    const appointment = await this.repository.save({
      confirm,
      initial_date,
      final_date,
    });
    return appointment;
  }
}
