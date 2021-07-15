import faker from "faker";
import { inject, injectable } from "tsyringe";

import auth from "@config/auth";
import { config } from "@config/environment";
import {
  CreateUserPhonesClientServiceRequestDTO,
  CreateUserPhonesClientServiceResponseDTO,
} from "@modules/accounts/dtos";
import { PhonesRepositoryInterface } from "@modules/accounts/repositories/Phones.repository.interface";
import { UsersRepositoryInterface } from "@modules/accounts/repositories/Users.repository.interface";
import { UsersTokensRepositoryInterface } from "@modules/accounts/repositories/UsersTokens.repository.interface";
import { DateProviderInterface } from "@shared/container/providers/DateProvider/Date.provider.interface";
import { HashProviderInterface } from "@shared/container/providers/HashProvider/Hash.provider.interface";
import { JwtProviderInterface } from "@shared/container/providers/JwtProvider/Jwt.provider.interface";
import { QueueProviderInterface } from "@shared/container/providers/QueueProvider/Queue.provider.interface";
import { SendSmsDTO } from "@shared/container/providers/SmsProvider/dtos/SendSms.dto";
import { AppError } from "@shared/errors/AppError";
import { FORBIDDEN } from "@shared/errors/constants";

@injectable()
class CreateUserPhonesClientService {
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
  }: CreateUserPhonesClientServiceRequestDTO): Promise<CreateUserPhonesClientServiceResponseDTO> {
    const phone = await this.phonesRepository.findPhoneUser({
      ddd,
      country_code,
      number,
    });

    if (phone && phone.users[0].id) {
      throw new AppError(FORBIDDEN.PHONE_BELONGS_TO_ANOTHER_USER);
    }

    const user = await this.usersRepository.createUserPhones({
      id: user_id,
      country_code,
      number,
      ddd,
    });

    const code = faker.phone.phoneNumber("####");

    const code_hash = await this.hashProvider.generateHash(code);

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
export { CreateUserPhonesClientService };
