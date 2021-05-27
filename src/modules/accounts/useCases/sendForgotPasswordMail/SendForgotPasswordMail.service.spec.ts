import { UsersRepositoryInMemory } from "@modules/accounts/repositories/in-memory/UserRepositoryInMemory";
import { UsersTokensRepositoryInMemory } from "@modules/accounts/repositories/in-memory/UsersTokensRepositoryInMemory";
import { IUsersRepository } from "@modules/accounts/repositories/IUsersRepository";
import { IUsersTokensRepository } from "@modules/accounts/repositories/IUsersTokensRepository";
import { SendForgotPasswordMailService } from "@modules/accounts/useCases/sendForgotPasswordMail/SendForgotPasswordMail.service";
import { IDateProvider } from "@shared/container/providers/DateProvider/IDateProvider";
import { DateFnsProvider } from "@shared/container/providers/DateProvider/implementations/DateFnsProvider";
import { IMailProvider } from "@shared/container/providers/MailProvider/IMailProvider";
import { MailProviderInMemory } from "@shared/container/providers/MailProvider/In-memory/MailProviderInMemory";
import { AppError } from "@shared/errors/AppError";
import { UsersFactory } from "@shared/infra/typeorm/factories";

let usersRepositoryInMemory: IUsersRepository;
let dateProvider: IDateProvider;
let usersTokensRepositoryInMemory: IUsersTokensRepository;
let mailProvider: IMailProvider;
let sendForgotPasswordMailService: SendForgotPasswordMailService;
describe("Send Forgot Mail", () => {
  const usersFactory = new UsersFactory();
  beforeEach(() => {
    usersRepositoryInMemory = new UsersRepositoryInMemory();
    dateProvider = new DateFnsProvider();
    usersTokensRepositoryInMemory = new UsersTokensRepositoryInMemory();
    mailProvider = new MailProviderInMemory();
    sendForgotPasswordMailService = new SendForgotPasswordMailService(
      usersRepositoryInMemory,
      usersTokensRepositoryInMemory,
      dateProvider,
      mailProvider
    );
  });

  it("should be able to send a forgot password mail to user", async () => {
    const usersRepositoryFindByEmail = jest.spyOn(
      usersRepositoryInMemory,
      "findByEmail"
    );
    const dateProviderAddMinutes = jest.spyOn(dateProvider, "addMinutes");
    const usersTokensRepositoryCreate = jest.spyOn(
      usersTokensRepositoryInMemory,
      "create"
    );
    const mailProviderSendMail = jest.spyOn(mailProvider, "sendMail");

    const [
      { name, last_name, cpf, rg, email, birth_date, password_hash },
    ] = usersFactory.generate({
      quantity: 1,
      active: true,
    });
    await usersRepositoryInMemory.create({
      name,
      last_name,
      cpf,
      rg,
      email,
      birth_date,
      password: password_hash,
    });
    await sendForgotPasswordMailService.execute(email);
    expect(usersRepositoryFindByEmail).toHaveBeenCalled();
    expect(dateProviderAddMinutes).toHaveBeenCalled();
    expect(usersTokensRepositoryCreate).toHaveBeenCalled();
    expect(mailProviderSendMail).toHaveBeenCalled();
  });

  it("should not be able to send email if user does not exists", async () => {
    await expect(
      sendForgotPasswordMailService.execute("e@mail.com")
    ).rejects.toEqual(new AppError({ message: "User does not exists!" }));
  });
});
