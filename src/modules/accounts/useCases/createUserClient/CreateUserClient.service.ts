import { resolve } from "path";
import { inject, injectable } from "tsyringe";
import { v4 as uuidV4 } from "uuid";

import { config } from "@config/environment";
import { ICreateUserClientDTO } from "@modules/accounts/dtos";
import { IUsersRepository } from "@modules/accounts/repositories/IUsersRepository";
import { IUsersTokensRepository } from "@modules/accounts/repositories/IUsersTokensRepository";
import { User } from "@sentry/node";
import { IDateProvider } from "@shared/container/providers/DateProvider/IDateProvider";
import { IHashProvider } from "@shared/container/providers/HashProvider/IHashProvider";
import { IMailProvider } from "@shared/container/providers/MailProvider/IMailProvider";
import { AppError } from "@shared/errors/AppError";

@injectable()
class CreateUserClientService {
  constructor(
    @inject("UsersRepository")
    private usersRepository: IUsersRepository,
    @inject("HashProvider")
    private hashProvider: IHashProvider,
    @inject("MailProvider")
    private mailProvider: IMailProvider,
    @inject("UsersTokensRepository")
    private usersTokensRepository: IUsersTokensRepository,
    @inject("DateProvider")
    private dateProvider: IDateProvider
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
      throw new AppError({ message: "User client already exist" });
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

    const templatePath = resolve(
      __dirname,
      "..",
      "..",
      "views",
      "emails",
      "confirmEmailUser.hbs"
    );

    await this.mailProvider.sendMail({
      to: email,
      subject: "Confirmação de cadastro",
      variables,
      path: templatePath,
    });

    return user;
  }
}
export { CreateUserClientService };
