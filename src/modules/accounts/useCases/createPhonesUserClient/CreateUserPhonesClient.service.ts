import faker from "faker";
import { inject, injectable } from "tsyringe";

import auth from "@config/auth";
import { config } from "@config/environment";
import { ICreateUserPhonesClientRequestDTO } from "@modules/accounts/dtos";
import { PhonesRepositoryInterface } from "@modules/accounts/repositories/PhonesRepository.interface";
import { UsersRepositoryInterface } from "@modules/accounts/repositories/UsersRepository.interface";
import { UsersTokensRepositoryInterface } from "@modules/accounts/repositories/UsersTokensRepository.interface";
import { CreateUserPhoneClientDTO } from "@modules/accounts/useCases/createPhonesUserClient/CreateUserPhoneClient.dto";
import { IDateProvider } from "@shared/container/providers/DateProvider/IDateProvider";
import { IHashProvider } from "@shared/container/providers/HashProvider/IHashProvider";
import { IJwtProvider } from "@shared/container/providers/JwtProvider/IJwtProvider";
import { QueueProviderInterface } from "@shared/container/providers/QueueProvider/QueueProvider.interface";
import { SendSmsDTO } from "@shared/container/providers/SmsProvider/dtos/SendSms.dto";
import { AppError } from "@shared/errors/AppError";

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
    private hashProvider: IHashProvider,
    @inject("JwtProvider")
    private jwtProvider: IJwtProvider,
    @inject("DateProvider")
    private dateProvider: IDateProvider
  ) {}
  async execute({
    user_id,
    country_code,
    number,
    ddd,
  }: ICreateUserPhonesClientRequestDTO): Promise<CreateUserPhoneClientDTO> {
    const phone = await this.phonesRepository.findPhoneUser({
      ddd,
      country_code,
      number,
    });

    if (phone && phone.users[0].id) {
      throw new AppError({
        message: "Phone belongs to another user",
      });
    }

    const user = await this.usersRepository.createUserPhones({
      user_id,
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
