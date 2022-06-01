import { instanceToInstance } from "class-transformer";
import { inject, injectable } from "tsyringe";
import { v4 as uuidV4 } from "uuid";

import { config } from "@config/environment";
import { CreateUserInsideServiceDTO } from "@modules/accounts/dtos";
import { TYPE_USER_TOKEN_ENUM } from "@modules/accounts/enums/TypeUserToken.enum";
import { UsersRepositoryInterface } from "@modules/accounts/repositories/Users.repository.interface";
import { UsersTokensRepositoryInterface } from "@modules/accounts/repositories/UsersTokens.repository.interface";
import { User } from "@sentry/node";
import { DateProviderInterface } from "@shared/container/providers/DateProvider/Date.provider.interface";
import { HashProviderInterface } from "@shared/container/providers/HashProvider/Hash.provider.interface";
import { SendMailDTO } from "@shared/container/providers/MailProvider/dtos";
import { MailContent } from "@shared/container/providers/MailProvider/enums/MailType.enum";
import { QueueProviderInterface } from "@shared/container/providers/QueueProvider/Queue.provider.interface";
import { AppError } from "@shared/errors/AppError";
import { CONFLICT } from "@shared/errors/constants";

@injectable()
export class CreateUserInsideService {
  constructor(
    @inject("UsersRepository")
    private usersRepository: UsersRepositoryInterface,
    @inject("HashProvider")
    private hashProvider: HashProviderInterface,
    @inject("UsersTokensRepository")
    private usersTokensRepository: UsersTokensRepositoryInterface,
    @inject("DateProvider")
    private dateProvider: DateProviderInterface,
    @inject("QueueProvider")
    private queueProvider: QueueProviderInterface
  ) {}
  async execute({
    name,
    last_name,
    cpf,
    rg,
    email,
    password,
    gender,
    details,
    birth_date,
  }: CreateUserInsideServiceDTO): Promise<User> {
    const userAlreadyExists = await this.usersRepository.findUserByEmailCpfRg({
      email,
      cpf,
      rg,
    });

    if (userAlreadyExists) {
      throw new AppError(CONFLICT.USER_CLIENT_ALREADY_EXIST);
    }

    const password_hash = await this.hashProvider.generateHash(password);

    const user = await this.usersRepository.createUserInsideType({
      name,
      last_name,
      cpf,
      rg,
      email,
      gender,
      details,
      password: password_hash,
      birth_date,
      active: false,
    });

    const refresh_token = uuidV4();

    const expires_date = this.dateProvider.addMinutes(
      config.mail.token.expiration_time
    );

    await this.usersTokensRepository.create({
      refresh_token,
      user_id: user.id,
      expires_date,
      type: TYPE_USER_TOKEN_ENUM.CREATE_USER_PROVIDER,
    });

    const variables = {
      name: user.name,
      link: `${process.env.CONFIRM_MAIL_URL}${refresh_token}`,
    };

    const message: SendMailDTO = {
      to: user.email,
      email_type: MailContent.USER_CONFIRMATION_EMAIL,
      variables,
    };

    const messages = [];

    messages.push({ value: JSON.stringify(message) });

    await this.queueProvider.sendMessage({
      topic: config.mail.queue.topic,
      messages,
    });

    return instanceToInstance(user);
  }
}
