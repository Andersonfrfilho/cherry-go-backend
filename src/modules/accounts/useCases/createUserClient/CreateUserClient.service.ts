import { classToClass } from "class-transformer";
import { inject, injectable } from "tsyringe";
import { v4 as uuidV4 } from "uuid";

import { config } from "@config/environment";
import { ICreateUserClientDTO } from "@modules/accounts/dtos";
import { UsersRepositoryInterface } from "@modules/accounts/repositories/UsersRepository.interface";
import { UsersTokensRepositoryInterface } from "@modules/accounts/repositories/UsersTokensRepository.interface";
import { User } from "@sentry/node";
import { IDateProvider } from "@shared/container/providers/DateProvider/IDateProvider";
import { IHashProvider } from "@shared/container/providers/HashProvider/IHashProvider";
import { ISendMailDTO } from "@shared/container/providers/MailProvider/dtos/ISendMailDTO";
import { MailContent } from "@shared/container/providers/MailProvider/enums/MailType.enum";
import { QueueProviderInterface } from "@shared/container/providers/QueueProvider/QueueProvider.interface";
import { AppError } from "@shared/errors/AppError";
import { CONFLICT } from "@shared/errors/constants";

@injectable()
class CreateUserClientService {
  constructor(
    @inject("UsersRepository")
    private usersRepository: UsersRepositoryInterface,
    @inject("HashProvider")
    private hashProvider: IHashProvider,
    @inject("UsersTokensRepository")
    private usersTokensRepository: UsersTokensRepositoryInterface,
    @inject("DateProvider")
    private dateProvider: IDateProvider,
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
    birth_date,
  }: ICreateUserClientDTO): Promise<User> {
    const userAlreadyExists = await this.usersRepository.findUserByEmailCpfRg({
      email,
      cpf,
      rg,
    });

    if (userAlreadyExists) {
      throw new AppError(CONFLICT.USER_CLIENT_ALREADY_EXIST);
    }

    const password_hash = await this.hashProvider.generateHash(password);

    const user = await this.usersRepository.createUserClientType({
      name,
      last_name,
      cpf,
      rg,
      email,
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
    });

    const variables = {
      name: user.name,
      link: `${process.env.CONFIRM_MAIL_URL}${refresh_token}`,
    };

    const message: ISendMailDTO = {
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

    return classToClass(user);
  }
}
export { CreateUserClientService };
