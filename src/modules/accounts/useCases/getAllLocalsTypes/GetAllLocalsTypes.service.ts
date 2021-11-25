import { inject, injectable } from "tsyringe";

import { LOCALS_TYPES_ENUM } from "@modules/accounts/enums/localsTypes.enum";
import { ProvidersRepositoryInterface } from "@modules/accounts/repositories/Providers.repository.interface";
import { UsersRepositoryInterface } from "@modules/accounts/repositories/Users.repository.interface";
import { PaymentType } from "@modules/appointments/infra/typeorm/entities/PaymentType";
import { PaymentTypeRepositoryInterface } from "@modules/appointments/repositories/PaymentType.repository.interface";
import { AppError } from "@shared/errors/AppError";
import { NOT_FOUND } from "@shared/errors/constants";

@injectable()
export class GetAllLocalsTypesService {
  constructor(
    @inject("UsersRepository")
    private usersRepository: UsersRepositoryInterface
  ) {}
  async execute(id: string): Promise<LOCALS_TYPES_ENUM[]> {
    const user = await this.usersRepository.findById(id);

    if (!user) {
      throw new AppError(NOT_FOUND.USER_DOES_NOT_EXIST);
    }

    return Object.values(LOCALS_TYPES_ENUM);
  }
}
