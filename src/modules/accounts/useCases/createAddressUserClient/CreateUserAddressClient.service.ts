import { inject, injectable } from "tsyringe";

import { CreateUserAddressClientServiceDTO } from "@modules/accounts/dtos";
import { UsersRepositoryInterface } from "@modules/accounts/repositories/Users.repository.interface";
import { User } from "@sentry/node";
import { AppError } from "@shared/errors/AppError";
import { NOT_FOUND } from "@shared/errors/constants";

@injectable()
export class CreateUserAddressClientService {
  constructor(
    @inject("UsersRepository")
    private usersRepository: UsersRepositoryInterface
  ) {}
  async execute({
    user_id,
    city,
    country,
    district,
    number,
    state,
    street,
    zipcode,
  }: CreateUserAddressClientServiceDTO): Promise<User> {
    const user_exist = await this.usersRepository.findById(user_id);

    if (!user_exist) {
      throw new AppError(NOT_FOUND.USER_NOT_EXIST);
    }

    const user = await this.usersRepository.createUserAddress({
      user: user_exist,
      city,
      country,
      district,
      number,
      state,
      street,
      zipcode,
    });

    return user;
  }
}
