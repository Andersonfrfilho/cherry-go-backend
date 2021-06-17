import { getRepository, Repository } from "typeorm";

import { CreateAppointmentRepositoryDTO } from "@modules/appointments/dtos";
import { Appointment } from "@modules/appointments/infra/typeorm/entities/Appointment";
import { AppointmentsRepositoryInterface } from "@modules/appointments/repositories/AppointmentsRepository.interface";

class CarsRepository implements AppointmentsRepositoryInterface {
  private repository: Repository<Appointment>;

  constructor() {
    this.repository = getRepository(Appointment);
  }

  async create({
    confirm,
    date,
  }: CreateAppointmentRepositoryDTO): Promise<Appointment> {
    const appointment = await this.repository.save({ confirm, date });

    return appointment;
  }
}

export { CarsRepository };
