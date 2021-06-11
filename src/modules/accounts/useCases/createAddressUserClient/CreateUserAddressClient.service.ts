import { inject, injectable } from "tsyringe";

import { ICreateUserAddressClientRequestDTO } from "@modules/accounts/dtos";
import { IUsersRepository } from "@modules/accounts/repositories/IUsersRepository";
import { User } from "@sentry/node";
import { AppError } from "@shared/errors/AppError";
import { BAD_REQUEST } from "@shared/errors/constants";

@injectable()
class CreateUserAddressClientService {
  constructor(
    @inject("UsersRepository")
    private usersRepository: IUsersRepository
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
  }: ICreateUserAddressClientRequestDTO): Promise<User> {
    const user_exist = await this.usersRepository.findById(user_id);

    if (!user_exist) {
      throw new AppError(BAD_REQUEST.USER_NOT_EXIST);
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
export { CreateUserAddressClientService };
