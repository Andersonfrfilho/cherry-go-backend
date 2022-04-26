import { inject, injectable } from "tsyringe";

import { Appointment } from "@modules/accounts/dtos/services/SetStageAppointmentClient.dto";
import { UsersRepositoryInterface } from "@modules/accounts/repositories/Users.repository.interface";
import { AppError } from "@shared/errors/AppError";
import { NOT_FOUND } from "@shared/errors/constants";

@injectable()
export class GetAppointmentsService {
  constructor(
    @inject("UsersRepository")
    private usersRepository: UsersRepositoryInterface
  ) {}
  async execute(id: string): Promise<[Appointment[], number]> {
    const client = await this.usersRepository.findById(id);

    if (!client) {
      throw new AppError(NOT_FOUND.USER_DOES_NOT_EXIST);
    }

    return this.usersRepository.getAllClientAppointments({ id: client.id });
  }
}
