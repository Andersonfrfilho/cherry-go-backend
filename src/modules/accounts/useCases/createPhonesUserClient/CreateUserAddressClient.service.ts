import { inject, injectable } from "tsyringe";

import { ICreateUserPhonesClientRequestDTO } from "@modules/accounts/dtos";
import { IPhonesRepository } from "@modules/accounts/repositories/IPhonesRepository";
import { IUsersRepository } from "@modules/accounts/repositories/IUsersRepository";
import { User } from "@sentry/node";
import { AppError } from "@shared/errors/AppError";

@injectable()
class CreateUserPhonesClientService {
  constructor(
    @inject("UsersRepository")
    private usersRepository: IUsersRepository,
    @inject("PhonesRepository")
    private phonesRepository: IPhonesRepository
  ) {}
  async execute({
    user_id,
    country_code,
    number,
    ddd,
  }: ICreateUserPhonesClientRequestDTO): Promise<User> {
    const phone = await this.phonesRepository.findPhoneUser({
      ddd,
      country_code,
      number,
    });

    if (phone && phone.users[0].id) {
      throw new AppError({
        message: "Phone not already register",
      });
    }

    const user = await this.usersRepository.createUserPhones({
      user_id,
      country_code,
      number,
      ddd,
    });
    return user;
  }
}
export { CreateUserPhonesClientService };
