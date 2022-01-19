import {
  add,
  differenceInYears,
  isBefore,
  toDate,
  addMinutes,
  subHours,
  addHours,
  isAfter,
  isEqual,
} from "date-fns";
import { inject, injectable } from "tsyringe";

import { ProvidersRepositoryInterface } from "@modules/accounts/repositories/Providers.repository.interface";
import { UsersRepositoryInterface } from "@modules/accounts/repositories/Users.repository.interface";
import { STATUS_PROVIDERS_APPOINTMENT } from "@modules/appointments/enums/StatusProvidersAppointment.enum";
import { AppointmentsRepositoryInterface } from "@modules/appointments/repositories/Appointments.repository.interface";
import { AppointmentsProvidersRepositoryInterface } from "@modules/appointments/repositories/AppointmentsProviders.repository.interface";
import { AppointmentsUsersRepositoryInterface } from "@modules/appointments/repositories/AppointmentsUsers.repository.interface";

@injectable()
export class TesteService {
  constructor(
    @inject("UsersRepository")
    private usersRepository: UsersRepositoryInterface,
    @inject("AppointmentsRepository")
    private appointmentsRepository: AppointmentsRepositoryInterface,
    @inject("AppointmentsProvidersRepository")
    private appointmentsProvidersRepository: AppointmentsProvidersRepositoryInterface,
    @inject("AppointmentsUsersRepository")
    private appointmentsUsersRepository: AppointmentsUsersRepositoryInterface
  ) {}
  async execute(): Promise<void> {
    const initial_date = new Date();

    const appointment = await this.appointmentsRepository.create({
      initial_date: addHours(initial_date, 1),
      confirm: true,
      final_date: addHours(initial_date, 2),
    });

    await this.appointmentsProvidersRepository.create({
      appointment_id: appointment.id,
      providers: [{ id: "a2f1f1ba-c35b-4d61-9bf2-e8900ac982e0" }],
      status: STATUS_PROVIDERS_APPOINTMENT.ACCEPTED,
    });

    await this.appointmentsUsersRepository.create({
      appointment_id: appointment.id,
      users: [{ id: "01b8ad20-a422-42a4-ae12-9281427d1706" }],
      active: true,
    });

    const appointment_two = await this.appointmentsRepository.create({
      initial_date: addHours(initial_date, 4),
      confirm: true,
      final_date: addHours(initial_date, 4.5),
    });

    await this.appointmentsProvidersRepository.create({
      appointment_id: appointment_two.id,
      providers: [{ id: "a2f1f1ba-c35b-4d61-9bf2-e8900ac982e0" }],
      status: STATUS_PROVIDERS_APPOINTMENT.ACCEPTED,
    });

    await this.appointmentsUsersRepository.create({
      appointment_id: appointment_two.id,
      users: [{ id: "01b8ad20-a422-42a4-ae12-9281427d1706" }],
      active: true,
    });

    const appointment_three = await this.appointmentsRepository.create({
      initial_date: addHours(initial_date, 6),
      confirm: true,
      final_date: addHours(initial_date, 8),
    });

    await this.appointmentsProvidersRepository.create({
      appointment_id: appointment_three.id,
      providers: [{ id: "a2f1f1ba-c35b-4d61-9bf2-e8900ac982e0" }],
      status: STATUS_PROVIDERS_APPOINTMENT.ACCEPTED,
    });

    await this.appointmentsUsersRepository.create({
      appointment_id: appointment_three.id,
      users: [{ id: "01b8ad20-a422-42a4-ae12-9281427d1706" }],
      active: true,
    });

    const appointment_four = await this.appointmentsRepository.create({
      initial_date: addHours(initial_date, 12),
      confirm: true,
      final_date: addHours(initial_date, 13.75),
    });

    await this.appointmentsProvidersRepository.create({
      appointment_id: appointment_four.id,
      providers: [{ id: "a2f1f1ba-c35b-4d61-9bf2-e8900ac982e0" }],
      status: STATUS_PROVIDERS_APPOINTMENT.ACCEPTED,
    });

    await this.appointmentsUsersRepository.create({
      appointment_id: appointment_four.id,
      users: [{ id: "01b8ad20-a422-42a4-ae12-9281427d1706" }],
      active: true,
    });

    const appointment_five = await this.appointmentsRepository.create({
      initial_date: addHours(initial_date, 16),
      confirm: true,
      final_date: addHours(initial_date, 17),
    });

    await this.appointmentsProvidersRepository.create({
      appointment_id: appointment_five.id,
      providers: [{ id: "a2f1f1ba-c35b-4d61-9bf2-e8900ac982e0" }],
      status: STATUS_PROVIDERS_APPOINTMENT.ACCEPTED,
    });

    await this.appointmentsUsersRepository.create({
      appointment_id: appointment_five.id,
      users: [{ id: "01b8ad20-a422-42a4-ae12-9281427d1706" }],
      active: true,
    });

    const appointment_six = await this.appointmentsRepository.create({
      initial_date: addHours(initial_date, 19),
      confirm: true,
      final_date: addHours(initial_date, 21),
    });

    await this.appointmentsProvidersRepository.create({
      appointment_id: appointment_six.id,
      providers: [{ id: "a2f1f1ba-c35b-4d61-9bf2-e8900ac982e0" }],
      status: STATUS_PROVIDERS_APPOINTMENT.ACCEPTED,
    });

    await this.appointmentsUsersRepository.create({
      appointment_id: appointment_six.id,
      users: [{ id: "01b8ad20-a422-42a4-ae12-9281427d1706" }],
      active: true,
    });
  }
}
