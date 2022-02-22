import { instanceToInstance } from "class-transformer";
import { inject, injectable } from "tsyringe";

import {
  PaginationPropsDTO,
  PaginationResponsePropsDTO,
} from "@modules/accounts/dtos/repositories/PaginationProps.dto";
import { User } from "@modules/accounts/infra/typeorm/entities/User";
import { UsersRepositoryInterface } from "@modules/accounts/repositories/Users.repository.interface";
import { BankProviderInterface } from "@shared/container/providers/BankProvider/Bank.provider.interface";
import { Bank } from "@shared/container/providers/BankProvider/dtos/GetAll.dto";
import { AppError } from "@shared/errors/AppError";
import { NOT_FOUND } from "@shared/errors/constants";

@injectable()
export class GetAllBanksService {
  constructor(
    @inject("UsersRepository")
    private usersRepository: UsersRepositoryInterface,
    @inject("BankProvider")
    private bankProvider: BankProviderInterface
  ) {}
  async execute(user_id: string): Promise<Array<Bank>> {
    const user = await this.usersRepository.findById(user_id);

    if (!user) {
      throw new AppError(NOT_FOUND.USER_DOES_NOT_EXIST);
    }

    const banks = await this.bankProvider.getAll();

    return banks;
  }
}
