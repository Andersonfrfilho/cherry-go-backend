import { inject, injectable } from "tsyringe";

import { CreateUserPhonesClientServiceRequestDTO } from "@modules/accounts/dtos";
import { TYPE_USER_TOKEN_ENUM } from "@modules/accounts/enums/TypeUserToken.enum";
import { PhonesRepositoryInterface } from "@modules/accounts/repositories/Phones.repository.interface";
import { UsersRepositoryInterface } from "@modules/accounts/repositories/Users.repository.interface";
import { UsersTokensRepositoryInterface } from "@modules/accounts/repositories/UsersTokens.repository.interface";
import { CacheProviderInterface } from "@shared/container/providers/CacheProvider/Cache.provider.interface";
import { CLIENT_PHONE_CACHE_KEY } from "@shared/container/providers/CacheProvider/keys/keys.const";
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
    @inject("UsersTokensRepository")
    private usersTokensRepository: UsersTokensRepositoryInterface,
    @inject("CacheProvider")
    private cacheProvider: CacheProviderInterface
  ) {}
  async execute(user_id: string): Promise<void> {
    const user_exist = await this.usersRepository.findById(user_id);

    if (!user_exist) {
      throw new AppError(NOT_FOUND.USER_DOES_NOT_EXIST);
    }

    const key = CLIENT_PHONE_CACHE_KEY(user_exist.id);

    await this.cacheProvider.invalidate(key);

    await this.usersTokensRepository.deleteByUserIdType({
      user_id,
      type: TYPE_USER_TOKEN_ENUM.PHONE_CONFIRMATION,
    });
  }
}
