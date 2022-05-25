import { inject, injectable } from "tsyringe";

import { CreateUserPhonesClientServiceRequestDTO } from "@modules/accounts/dtos";
import { PhonesRepositoryInterface } from "@modules/accounts/repositories/Phones.repository.interface";
import { UsersRepositoryInterface } from "@modules/accounts/repositories/Users.repository.interface";
import { UsersTokensRepositoryInterface } from "@modules/accounts/repositories/UsersTokens.repository.interface";
import { DateProviderInterface } from "@shared/container/providers/DateProvider/Date.provider.interface";
import { HashProviderInterface } from "@shared/container/providers/HashProvider/Hash.provider.interface";
import { JwtProviderInterface } from "@shared/container/providers/JwtProvider/Jwt.provider.interface";
import { QueueProviderInterface } from "@shared/container/providers/QueueProvider/Queue.provider.interface";
import { AppError } from "@shared/errors/AppError";
import { NOT_FOUND } from "@shared/errors/constants";

@injectable()
export class DeletePhonesUserClientService {
  constructor(
    @inject("UsersRepository")
    private usersRepository: UsersRepositoryInterface,
    @inject("PhonesRepository")
    private phonesRepository: PhonesRepositoryInterface,
    @inject("UsersTokensRepository")
    private usersTokensRepository: UsersTokensRepositoryInterface,
    @inject("QueueProvider")
    private queueProvider: QueueProviderInterface,
    @inject("HashProvider")
    private hashProvider: HashProviderInterface,
    @inject("JwtProvider")
    private jwtProvider: JwtProviderInterface,
    @inject("DateProvider")
    private dateProvider: DateProviderInterface
  ) {}
  async execute({
    user_id,
    country_code,
    number,
    ddd,
  }: CreateUserPhonesClientServiceRequestDTO): Promise<void> {
    const user_exist = await this.usersRepository.findById(user_id);

    if (!user_exist) {
      throw new AppError(NOT_FOUND.USER_DOES_NOT_EXIST);
    }

    const phone = await this.phonesRepository.findPhoneUser({
      ddd,
      country_code,
      number,
    });

    if (!phone && !phone.users[0].id) {
      throw new AppError(NOT_FOUND.PHONE_DOES_NOT_EXIST);
    }

    await this.usersRepository.deleteUserPhones({
      id: user_id,
      country_code,
      number,
      ddd,
    });

    await this.usersTokensRepository.findByUserAndRemoveTokens(user_id);
  }
}
