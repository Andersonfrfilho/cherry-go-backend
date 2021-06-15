import { inject, injectable } from "tsyringe";
import { v4 as uuidV4 } from "uuid";

import { config } from "@config/environment";
import { IUsersTokensRepository } from "@modules/accounts/repositories/IUsersTokensRepository";
import { UsersRepositoryInterface } from "@modules/accounts/repositories/UsersRepository.interface";
import { IDateProvider } from "@shared/container/providers/DateProvider/IDateProvider";
import { ISendMailDTO } from "@shared/container/providers/MailProvider/dtos/ISendMailDTO";
import { MailContent } from "@shared/container/providers/MailProvider/enums/MailType.enum";
import { QueueProviderInterface } from "@shared/container/providers/QueueProvider/QueueProvider.interface";
import { TopicsQueueEnum } from "@shared/container/providers/QueueProvider/topics/sendEmail.topics";
import { AppError } from "@shared/errors/AppError";
import { NOT_FOUND } from "@shared/errors/constants";

@injectable()
class SendForgotPasswordMailService {
  constructor(
    @inject("UsersRepository")
    private usersRepository: UsersRepositoryInterface,
    @inject("UsersTokensRepository")
    private usersTokensRepository: IUsersTokensRepository,
    @inject("DateProvider")
    private dateProvider: IDateProvider,
    @inject("QueueProvider")
    private queueProvider: QueueProviderInterface
  ) {}
  async execute(email: string): Promise<void> {
    const user = await this.usersRepository.findByEmail(email);

    if (!user) {
      throw new AppError(NOT_FOUND.USER_DOES_NOT_EXIST);
    }

    const refresh_token = uuidV4();
    const expires_date = this.dateProvider.addMinutes(
      config.password.time_token_expires
    );

    await this.usersTokensRepository.create({
      refresh_token,
      user_id: user.id,
      expires_date,
    });

    const variables = {
      name: user.name,
      link: `${process.env.FORGOT_MAIL_URL}${refresh_token}`,
    };

    const message: ISendMailDTO = {
      to: user.email,
      email_type: MailContent.FORGOT_PASSWORD,
      variables,
    };
    const messages = [];

    messages.push({ value: JSON.stringify(message) });

    await this.queueProvider.sendMessage({
      topic: TopicsQueueEnum.SEND_MAIL,
      messages,
    });
  }
}

export { SendForgotPasswordMailService };
