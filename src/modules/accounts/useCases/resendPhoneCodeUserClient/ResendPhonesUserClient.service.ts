import faker from "faker";
import { inject, injectable } from "tsyringe";

import { config } from "@config/environment";
import { CODE_STAGING_TEST } from "@modules/accounts/constants/PhoneConfirmCode.const";
import {
  CreateUserPhonesClientServiceRequestDTO,
  CreateUserPhonesClientServiceResponseDTO,
  ResendPhoneCodeUserClientServiceDTO,
} from "@modules/accounts/dtos";
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
import { SendSmsDTO } from "@shared/container/providers/SmsProvider/dtos/SendSms.dto";
import { ENVIRONMENT_TYPE_ENUMS } from "@shared/enums/EnvironmentType.enum";
import { AppError } from "@shared/errors/AppError";
import { FORBIDDEN, NOT_FOUND } from "@shared/errors/constants";

@injectable()
class ResendPhoneCodeUserClientService {
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
    private dateProvider: DateProviderInterface,
    @inject("CacheProvider")
    private cacheProvider: CacheProviderInterface
  ) {}
  async execute({
    user_id,
  }: ResendPhoneCodeUserClientServiceDTO): Promise<CreateUserPhonesClientServiceResponseDTO> {
    const user = await this.usersRepository.findById(user_id);

    if (!user) {
      throw new AppError(NOT_FOUND.USER_DOES_NOT_EXIST);
    }

    const key = CLIENT_PHONE_CACHE_KEY(user.id);

    const phone = await this.cacheProvider.recover<
      Partial<CreateUserPhonesClientServiceRequestDTO>
    >(key);

    if (!phone) {
      throw new AppError(NOT_FOUND.PHONE_DOES_RECOVER);
    }

    const { number, country_code, ddd } = phone;

    const code = Object.values(ENVIRONMENT_TYPE_ENUMS).includes(
      process.env.ENVIRONMENT as ENVIRONMENT_TYPE_ENUMS
    )
      ? number.slice(CODE_STAGING_TEST)
      : faker.phone.phoneNumber("####");

    const code_hash = await this.hashProvider.generateHash(code);

    await this.usersTokensRepository.deleteByUserIdType({
      user_id: user.id,
      type: TYPE_USER_TOKEN_ENUM.PHONE_CONFIRMATION,
    });

    const { auth } = config;

    const refresh_token = this.jwtProvider.assign({
      payload: { email: user.email },
      secretOrPrivateKey: auth.secret.refresh,
      options: {
        expiresIn: auth.expires_in.refresh,
        subject: {
          user: { id: user.id, active: user.active, types: user.types },
          code_hash,
        },
      },
    });

    const expires_date = this.dateProvider.addMinutes(
      config.sms.token.expiration_time
    );

    await this.usersTokensRepository.create({
      refresh_token,
      user_id: user.id,
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

    return { user, token: refresh_token };
  }
}
export { ResendPhoneCodeUserClientService };
