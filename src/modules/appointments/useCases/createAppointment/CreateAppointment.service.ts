import { inject, injectable } from "tsyringe";

import { UsersRepositoryInterface } from "@modules/accounts/repositories/UsersRepository.interface";
import { CreateAppointmentServiceDTO } from "@modules/appointments/dtos";
import { AppError } from "@shared/errors/AppError";
import { BAD_REQUEST } from "@shared/errors/constants";

@injectable()
class CreateAppointmentService {
  constructor(
    @inject("UsersRepository")
    private usersRepository: UsersRepositoryInterface
  ) {}
  async execute({
    services,
    transactionsservices,
    transportsservices,
    usersservices,
    providersservices,
    providers_services,
  }: CreateAppointmentServiceDTO): Promise<void> {
    const user = await this.usersRepository.findUserByEmailCpfRg({
      email,
      cpf,
      rg,
    });

    if (!user) {
      throw new AppError(BAD_REQUEST.USER_NOT_EXIST);
    }

    await this.usersRepository.updateActiveUser({
      id: user.id,
      active: true,
    });
  }
}
export { CreateAppointmentService };
