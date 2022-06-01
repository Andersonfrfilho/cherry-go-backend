import { inject, injectable } from "tsyringe";
import { v4 as uuidV4 } from "uuid";

import { config } from "@config/environment";
import { TYPE_USER_TOKEN_ENUM } from "@modules/accounts/enums/TypeUserToken.enum";
import { UsersRepositoryInterface } from "@modules/accounts/repositories/Users.repository.interface";
import { UsersTokensRepositoryInterface } from "@modules/accounts/repositories/UsersTokens.repository.interface";
import { DateProviderInterface } from "@shared/container/providers/DateProvider/Date.provider.interface";
import { SendMailDTO } from "@shared/container/providers/MailProvider/dtos";
import { MailContent } from "@shared/container/providers/MailProvider/enums/MailType.enum";
import { QueueProviderInterface } from "@shared/container/providers/QueueProvider/Queue.provider.interface";
import { AppError } from "@shared/errors/AppError";
import { NOT_FOUND } from "@shared/errors/constants";

@injectable()
export class ResendConfirmationMailUserMailService {
  constructor(
    @inject("UsersRepository")
    private usersRepository: UsersRepositoryInterface,
    @inject("UsersTokensRepository")
    private usersTokensRepository: UsersTokensRepositoryInterface,
    @inject("DateProvider")
    private dateProvider: DateProviderInterface,
    @inject("QueueProvider")
    private queueProvider: QueueProviderInterface
  ) {}
  async execute(email: string): Promise<void> {
    const user = await this.usersRepository.findByEmail(email);

    if (!user) {
      throw new AppError(NOT_FOUND.USER_DOES_NOT_EXIST);
    }

    await this.usersTokensRepository.deleteByUserIdType({
      user_id: user.id,
      type: TYPE_USER_TOKEN_ENUM.PHONE_CONFIRMATION,
    });

    const refresh_token = uuidV4();

    const expires_date = this.dateProvider.addMinutes(
      config.mail.token.expiration_time
    );

    await this.usersTokensRepository.deleteByUserIdType({
      user_id: user.id,
      type: TYPE_USER_TOKEN_ENUM.EMAIL_CONFIRMATION,
    });

    await this.usersTokensRepository.create({
      refresh_token,
      user_id: user.id,
      expires_date,
      type: TYPE_USER_TOKEN_ENUM.EMAIL_CONFIRMATION,
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
  }
}
