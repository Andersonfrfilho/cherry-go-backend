import { classToClass } from "class-transformer";
import { inject, injectable } from "tsyringe";

import {
  PaginationPropsDTO,
  PaginationResponsePropsDTO,
} from "@modules/accounts/dtos/repositories/PaginationProps.dto";
import { User } from "@modules/accounts/infra/typeorm/entities/User";
import { UsersRepositoryInterface } from "@modules/accounts/repositories/Users.repository.interface";

@injectable()
export class GetUsersService {
  constructor(
    @inject("UsersRepository")
    private usersRepository: UsersRepositoryInterface
  ) {}
  async execute({
    order,
    page,
    per_page,
    fields,
  }: PaginationPropsDTO): Promise<PaginationResponsePropsDTO<User>> {
    const users = await this.usersRepository.findUsersWithPages({
      fields,
      order,
      page,
      per_page,
    });

    return classToClass(users);
  }
}
