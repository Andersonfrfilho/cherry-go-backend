import { inject, injectable } from "tsyringe";

import { UsersRepositoryInterface } from "@modules/accounts/repositories/UsersRepository.interface";
import { CreateAppointmentServiceDTO } from "@modules/appointments/dtos";
import { AppointmentsRepositoryInterface } from "@modules/appointments/repositories/AppointmentsRepository.interface";

@injectable()
class CreateAppointmentService {
  constructor(
    @inject("UsersRepository")
    private usersRepository: UsersRepositoryInterface,
    @inject("UsersRepository")
    private appointmentsRepository: AppointmentsRepositoryInterface
  ) {}
  async execute({
    users,
    providers,
    services,
    transactions,
    transports,
    providers_services,
  }: CreateAppointmentServiceDTO): Promise<void> {
    await this.
  }
}
export { CreateAppointmentService };
