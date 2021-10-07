import { inject, injectable } from "tsyringe";

import { config } from "@config/environment";
import { ProvidersRepositoryInterface } from "@modules/accounts/repositories/Providers.repository.interface";
import { RejectAppointmentServiceDTO } from "@modules/appointments/dtos/services/RejectAppointment.service.dto";
import { STATUS_PROVIDERS_APPOINTMENT } from "@modules/appointments/enums/StatusProvidersAppointment.enum";
import { AppointmentsRepositoryInterface } from "@modules/appointments/repositories/Appointments.repository.interface";
import { AppointmentsProvidersRepositoryInterface } from "@modules/appointments/repositories/AppointmentsProviders.repository.interface";
import { DateProviderInterface } from "@shared/container/providers/DateProvider/Date.provider.interface";
import { AppError } from "@shared/errors/AppError";
import { BAD_REQUEST, NOT_FOUND } from "@shared/errors/constants";

@injectable()
export class RejectAppointmentProviderService {
  constructor(
    @inject("ProvidersRepository")
    private providersRepository: ProvidersRepositoryInterface,
    @inject("AppointmentsRepository")
    private appointmentsRepository: AppointmentsRepositoryInterface,
    @inject("AppointmentsProvidersRepository")
    private appointmentsProvidersRepository: AppointmentsProvidersRepositoryInterface,
    @inject("DateProvider")
    private dateProvider: DateProviderInterface
  ) {}
  async execute({
    provider_id,
    appointment_id,
  }: RejectAppointmentServiceDTO): Promise<void> {
    const provider = await this.providersRepository.findById(provider_id);

    if (!provider) {
      throw new AppError(NOT_FOUND.PROVIDER_DOES_NOT_EXIST);
    }

    const appointment = await this.appointmentsRepository.findById(
      appointment_id
    );

    if (!appointment) {
      throw new AppError(NOT_FOUND.APPOINTMENT_DOES_NOT_EXIST);
    }

    const date = this.dateProvider.subHours({
      date: new Date(),
      hours: config.appointment.hour_allowed_cancellation,
    });

    if (
      this.dateProvider.compareIfBefore(
        new Date(appointment.initial_date),
        date
      )
    ) {
      throw new AppError(BAD_REQUEST.APPOINTMENT_HAS_PASSED_THE_DATE);
    }

    const provider_appointment = await this.appointmentsProvidersRepository.findByIds(
      {
        appointment_id,
        provider_id,
      }
    );

    if (!provider_appointment) {
      throw new AppError(NOT_FOUND.APPOINTMENT_PROVIDER_DOES_NOT_EXIST);
    }

    if (provider_appointment.status === STATUS_PROVIDERS_APPOINTMENT.REJECTED) {
      throw new AppError(BAD_REQUEST.APPOINTMENT_ALREADY_REJECTED);
    }

    if (provider_appointment.status === STATUS_PROVIDERS_APPOINTMENT.ACCEPTED) {
      throw new AppError(BAD_REQUEST.APPOINTMENT_ALREADY_ACCEPTED);
    }

    await this.appointmentsProvidersRepository.changeStatusAppointment({
      appointment_id,
      provider_id,
      status: STATUS_PROVIDERS_APPOINTMENT.REJECTED,
    });
  }
}
