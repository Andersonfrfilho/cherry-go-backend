import { inject, injectable } from "tsyringe";

import { ProvidersRepositoryInterface } from "@modules/accounts/repositories/ProvidersRepository.interface";
import { UsersRepositoryInterface } from "@modules/accounts/repositories/UsersRepository.interface";
import { CreateAppointmentServiceDTO } from "@modules/appointments/dtos";
import { AppointmentsProvidersRepositoryInterface } from "@modules/appointments/repositories/AppointmentsProvidersRepository.interface";
import { AppointmentsRepositoryInterface } from "@modules/appointments/repositories/AppointmentsRepository.interface";
import { AppointmentsUsersRepositoryInterface } from "@modules/appointments/repositories/AppointmentsUsersRepository.interface";
import { AppError } from "@shared/errors/AppError";
import { NOT_FOUND } from "@shared/errors/constants";

@injectable()
export class CreateAppointmentService {
  constructor(
    @inject("UsersRepository")
    private usersRepository: UsersRepositoryInterface,
    @inject("ProvidersRepository")
    private providersRepository: ProvidersRepositoryInterface,
    @inject("AppointmentsRepository")
    private appointmentsRepository: AppointmentsRepositoryInterface,
    @inject("AppointmentsUsersRepository")
    private appointmentsUsersRepository: AppointmentsUsersRepositoryInterface,
    @inject("AppointmentsProvidersRepository")
    private appointmentsProvidersRepository: AppointmentsProvidersRepositoryInterface
  ) {}
  async execute({
    users,
    appointment,
    providers,
    transports,
    transactions,
  }: CreateAppointmentServiceDTO): Promise<void> {
    const appointment_created = await this.appointmentsRepository.create(
      appointment
    );

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
      providers
    );

    if (providers_founds.length !== providers.length) {
      throw new AppError(NOT_FOUND.PROVIDER_DOES_NOT_EXIST);
    }

    await this.appointmentsProvidersRepository.create({
      appointment_id: appointment_created.id,
      providers: providers_founds,
      active: false,
    });

    const services = await providers_founds.filter((provider_found,index)=>{
      if(provider_found.services.filter((service,index_service)=>{
        if(service.id===providers[index].services[index_service].id)
      }))
    })
    // const transport = await this.transportProvider
  }
}
