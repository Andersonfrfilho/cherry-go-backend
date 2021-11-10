import { classToClass } from "class-transformer";
import { inject, injectable } from "tsyringe";
import { v4 as uuidV4 } from "uuid";

import { config } from "@config/environment";
import { CreateUserProviderServiceDTO } from "@modules/accounts/dtos/services/CreateUserProviderType.service.dto";
import { ProvidersRepositoryInterface } from "@modules/accounts/repositories/Providers.repository.interface";
import { UsersRepositoryInterface } from "@modules/accounts/repositories/Users.repository.interface";
import { UsersTokensRepositoryInterface } from "@modules/accounts/repositories/UsersTokens.repository.interface";
import { User } from "@sentry/node";
import { DateProviderInterface } from "@shared/container/providers/DateProvider/Date.provider.interface";
import { HashProviderInterface } from "@shared/container/providers/HashProvider/Hash.provider.interface";
import { SendMailDTO } from "@shared/container/providers/MailProvider/dtos";
import { MailContent } from "@shared/container/providers/MailProvider/enums/MailType.enum";
import { PaymentProviderInterface } from "@shared/container/providers/PaymentProvider/Payment.provider.interface";
import { QueueProviderInterface } from "@shared/container/providers/QueueProvider/Queue.provider.interface";
import { AppError } from "@shared/errors/AppError";
import { CONFLICT } from "@shared/errors/constants";

@injectable()
export class CreateUserProviderService {
  constructor(
    @inject("UsersRepository")
    private usersRepository: UsersRepositoryInterface,
    @inject("ProvidersRepository")
    private providersRepository: ProvidersRepositoryInterface,
    @inject("HashProvider")
    private hashProvider: HashProviderInterface,
    @inject("UsersTokensRepository")
    private usersTokensRepository: UsersTokensRepositoryInterface,
    @inject("DateProvider")
    private dateProvider: DateProviderInterface,
    @inject("QueueProvider")
    private queueProvider: QueueProviderInterface,
    @inject("PaymentProvider")
    private paymentProvider: PaymentProviderInterface
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
    term,
    term_provider,
  }: CreateUserProviderServiceDTO): Promise<User> {
    const userAlreadyExists = await this.usersRepository.findUserByEmailCpfRg({
      email,
      cpf,
      rg,
    });

    if (userAlreadyExists) {
      throw new AppError(CONFLICT.USER_CLIENT_ALREADY_EXIST);
    }

    const password_hash = await this.hashProvider.generateHash(password);

    const user_client_bank = await this.paymentProvider.createAccountClient({
      email,
      name,
      cpf,
    });

    const user_account_bank = await this.paymentProvider.createAccount({
      email,
      name,
      cpf,
    });

    const user = await this.providersRepository.createUserProviderType({
      name,
      last_name,
      cpf,
      rg,
      email,
      gender,
      password: password_hash,
      birth_date,
      active: false,
      term,
      term_provider,
      details: {
        stripe: {
          customer: {
            id: user_client_bank.id,
          },
          account: {
            id: user_account_bank.id,
          },
        },
        ...details,
      },
    });

    // PEGAR O IP
    await this.paymentProvider.updateAccount({
      external_id: user_account_bank.id,
      tos_acceptance: { date: Math.round(Date.now() / 1000), ip: "8.8.8.8" },
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

    return classToClass(user);
  }
}
