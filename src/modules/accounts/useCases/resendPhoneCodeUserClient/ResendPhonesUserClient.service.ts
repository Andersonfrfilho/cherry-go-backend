import faker from "faker";
import { inject, injectable } from "tsyringe";

import auth from "@config/auth";
import { config } from "@config/environment";
import { CODE_STAGING_TEST } from "@modules/accounts/constants/PhoneConfirmCode.const";
import {
  CreateUserPhonesClientServiceResponseDTO,
  ResendPhoneCodeUserClientServiceDTO,
} from "@modules/accounts/dtos";
import { PhonesRepositoryInterface } from "@modules/accounts/repositories/Phones.repository.interface";
import { UsersRepositoryInterface } from "@modules/accounts/repositories/Users.repository.interface";
import { UsersTokensRepositoryInterface } from "@modules/accounts/repositories/UsersTokens.repository.interface";
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
    private dateProvider: DateProviderInterface
  ) {}
  async execute({
    user_id,
  }: ResendPhoneCodeUserClientServiceDTO): Promise<CreateUserPhonesClientServiceResponseDTO> {
    const user = await this.usersRepository.findById(user_id);

    if (!user) {
      throw new AppError(NOT_FOUND.USER_DOES_NOT_EXIST);
    }

    if (!(user.phones && user.phones[0] && user.phones[0].number)) {
      throw new AppError(NOT_FOUND.PHONE_DOES_NOT_EXIST);
    }

    const { number, country_code, ddd } = user.phones[0];

    const code = Object.values(ENVIRONMENT_TYPE_ENUMS).includes(
      process.env.ENVIRONMENT as ENVIRONMENT_TYPE_ENUMS
    )
      ? number.slice(CODE_STAGING_TEST)
      : faker.phone.phoneNumber("####");

    const code_hash = await this.hashProvider.generateHash(code);

    await this.usersTokensRepository.findByUserAndRemoveTokens(user.id);

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
    });

    const message: SendSmsDTO = {
      to: `${country_code}${ddd}${number}`,
      from: config.application.name,
      text: `confirme seu numero com o código: ${code}`,
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
