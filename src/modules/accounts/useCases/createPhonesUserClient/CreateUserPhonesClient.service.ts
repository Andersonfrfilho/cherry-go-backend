import { instanceToInstance } from "class-transformer";
import faker from "faker";
import { inject, injectable } from "tsyringe";

import { config } from "@config/environment";
import { CODE_STAGING_TEST } from "@modules/accounts/constants/PhoneConfirmCode.const";
import {
  CreateUserPhonesClientServiceRequestDTO,
  CreateUserPhonesClientServiceResponseDTO,
} from "@modules/accounts/dtos";
import { TYPE_USER_TOKEN_ENUM } from "@modules/accounts/enums/TypeUserToken.enum";
import { UserPhone } from "@modules/accounts/infra/typeorm/entities/UserPhone";
import { UsersRepositoryInterface } from "@modules/accounts/repositories/Users.repository.interface";
import { UsersTokensRepositoryInterface } from "@modules/accounts/repositories/UsersTokens.repository.interface";
import { CacheProviderInterface } from "@shared/container/providers/CacheProvider/Cache.provider.interface";
import { IOREDIS_EXPIRED_ENUM } from "@shared/container/providers/CacheProvider/ioredis.cache.enums";
import { CLIENT_PHONE_CACHE_KEY } from "@shared/container/providers/CacheProvider/keys/keys.const";
import { DateProviderInterface } from "@shared/container/providers/DateProvider/Date.provider.interface";
import { HashProviderInterface } from "@shared/container/providers/HashProvider/Hash.provider.interface";
import { JwtProviderInterface } from "@shared/container/providers/JwtProvider/Jwt.provider.interface";
import { QueueProviderInterface } from "@shared/container/providers/QueueProvider/Queue.provider.interface";
import { SendSmsDTO } from "@shared/container/providers/SmsProvider/dtos/SendSms.dto";
import { ENVIRONMENT_TYPE_ENUMS } from "@shared/enums/EnvironmentType.enum";
import { AppError } from "@shared/errors/AppError";
import { CONFLICT, FORBIDDEN, NOT_FOUND } from "@shared/errors/constants";

@injectable()
class CreateUserPhonesClientService {
  constructor(
    @inject("UsersRepository")
    private usersRepository: UsersRepositoryInterface,
    @inject("CacheProvider")
    private cacheProvider: CacheProviderInterface,
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
  }: CreateUserPhonesClientServiceRequestDTO): Promise<CreateUserPhonesClientServiceResponseDTO> {
    const user_exist = await this.usersRepository.findById(user_id);

    const { auth } = config;

    if (!user_exist) {
      throw new AppError(NOT_FOUND.USER_DOES_NOT_EXIST);
    }

    if (user_exist.phones.length > 0) {
      throw new AppError(CONFLICT.USER_ALREADY_HAS_A_LINKED_PHONE);
    }

    const phone_structure = {
      country_code,
      ddd,
      number,
    };

    const key = CLIENT_PHONE_CACHE_KEY(user_exist.id);

    await this.cacheProvider.save(
      key,
      phone_structure,
      IOREDIS_EXPIRED_ENUM.EX,
      config.phone.cache.invalidade.time
    );

    const code = Object.values(ENVIRONMENT_TYPE_ENUMS).includes(
      process.env.ENVIRONMENT as ENVIRONMENT_TYPE_ENUMS
    )
      ? number.slice(CODE_STAGING_TEST)
      : faker.phone.phoneNumber("####");

    const code_hash = await this.hashProvider.generateHash(code);

    const refresh_token = this.jwtProvider.assign({
      payload: { email: user_exist.email },
      secretOrPrivateKey: auth.secret.refresh,
      options: {
        expiresIn: auth.expires_in.refresh,
        subject: {
          user: {
            id: user_exist.id,
            active: user_exist.active,
            types: user_exist.types,
          },
          code_hash,
        },
      },
    });

    const expires_date = this.dateProvider.addMinutes(
      config.sms.token.expiration_time
    );
    await this.usersTokensRepository.deleteByUserIdType({
      user_id: user_exist.id,
      type: TYPE_USER_TOKEN_ENUM.PHONE_CONFIRMATION,
    });

    await this.usersTokensRepository.create({
      refresh_token,
      user_id: user_exist.id,
      expires_date,
      type: TYPE_USER_TOKEN_ENUM.PHONE_CONFIRMATION,
    });

    const message: SendSmsDTO = {
      subject: "Confirmação de telefone",
      to: `${country_code}${ddd}${number}`,
      from: config.application.name,
      text: `Cherry-go, confirme seu numero com o código: ${code}`,
    };

    const messages = [];

    messages.push({ value: JSON.stringify(message) });

    await this.queueProvider.sendMessage({
      topic: config.sms.queue.topic,
      messages,
    });

    const user_new_event = await this.usersRepository.findById(user_id);

    return {
      user: {
        ...instanceToInstance(user_new_event),
        phones: [
          { phone: { country_code, ddd, number }, active: false } as UserPhone,
        ],
      },
      token: refresh_token,
    };
  }
}
export { CreateUserPhonesClientService };
