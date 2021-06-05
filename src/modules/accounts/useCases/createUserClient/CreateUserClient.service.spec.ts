import "reflect-metadata";
import faker from "faker";
import * as uuid from "uuid";

import { config } from "@config/environment";
import { usersRepositoryMock } from "@modules/accounts/repositories/mocks/UserRepository.mock";
import { usersTokensRepositoryMock } from "@modules/accounts/repositories/mocks/UsersTokensRepository.mock";
import { CreateUserClientService } from "@modules/accounts/useCases/createUserClient/CreateUserClient.service";
import { dateProviderMock } from "@shared/container/providers/DateProvider/mocks/DateProvider.mock";
import { hashProviderMock } from "@shared/container/providers/HashProvider/mocks/HashProvider.mock";
import { ISendMailDTO } from "@shared/container/providers/MailProvider/dtos/ISendMailDTO";
import { MailContent } from "@shared/container/providers/MailProvider/enums/MailType.enum";
import { queueProviderMock } from "@shared/container/providers/QueueProvider/mocks/QueueProvider.mock";
import { AppError } from "@shared/errors/AppError";
import {
  UsersFactory,
  UsersTypesFactory,
} from "@shared/infra/typeorm/factories";

let createUserService: CreateUserClientService;
const mockedDate = new Date("2020-09-01T09:33:37");
jest.mock("uuid");
jest.useFakeTimers("modern").setSystemTime(mockedDate.getTime());

describe("Create users clients service", () => {
  const usersFactory = new UsersFactory();
  const usersTypesFactory = new UsersTypesFactory();

  beforeEach(() => {
    createUserService = new CreateUserClientService(
      usersRepositoryMock,
      hashProviderMock,
      usersTokensRepositoryMock,
      dateProviderMock,
      queueProviderMock
    );
  });

  it("should be able to create an user", async () => {
    // arrange
    const [
      { name, last_name, cpf, rg, email, birth_date, password_hash },
    ] = usersFactory.generate({ quantity: 1 });
    const types = usersTypesFactory.generate();
    const uuidFake = faker.datatype.uuid();
    const variables = {
      name,
      link: `${process.env.CONFIRM_MAIL_URL}${uuidFake}`,
    };
    const message: ISendMailDTO = {
      to: email,
      email_type: MailContent.USER_CONFIRMATION_EMAIL,
      variables,
    };
    const messages = [];
    messages.push({ value: JSON.stringify(message) });

    usersRepositoryMock.findUserByEmailCpfRg.mockResolvedValue(undefined);
    hashProviderMock.generateHash.mockResolvedValue(password_hash);
    usersRepositoryMock.createUserClientType.mockResolvedValue({
      id: uuidFake,
      name,
      last_name,
      cpf,
      rg,
      email,
      birth_date,
      password_hash,
      types: [{ ...types[0], id: uuidFake }],
    });
    dateProviderMock.addMinutes.mockReturnValue(mockedDate);
    jest.spyOn(uuid, "v4").mockReturnValue(uuidFake);
    usersTokensRepositoryMock.create.mockResolvedValue({});
    queueProviderMock.sendMessage.mockResolvedValue({});

    // act
    const result = await createUserService.execute({
      name,
      last_name,
      cpf,
      rg,
      email,
      birth_date,
      password: password_hash,
    });

    // assert
    expect(usersRepositoryMock.findUserByEmailCpfRg).toHaveBeenCalledWith({
      cpf,
      rg,
      email,
    });
    expect(hashProviderMock.generateHash).toHaveBeenCalledWith(password_hash);
    expect(usersRepositoryMock.createUserClientType).toHaveBeenCalledWith({
      name,
      last_name,
      cpf,
      rg,
      email,
      birth_date,
      password: password_hash,
      active: false,
    });
    expect(dateProviderMock.addMinutes).toHaveBeenCalledWith(
      config.mail.token.expiration_time
    );
    expect(usersTokensRepositoryMock.create).toHaveBeenCalledWith({
      refresh_token: uuidFake,
      user_id: uuidFake,
      expires_date: mockedDate,
    });

    expect(queueProviderMock.sendMessage).toHaveBeenCalledWith({
      topic: config.mail.queue.topic,
      messages,
    });
    expect(result).toEqual(
      expect.objectContaining({
        id: expect.any(String) && uuidFake,
        name: expect.any(String) && name,
        last_name: expect.any(String) && last_name,
        cpf: expect.any(String) && cpf,
        rg: expect.any(String) && rg,
        email: expect.any(String) && email,
        password_hash: expect.any(String) && password_hash,
        birth_date: expect.any(Date) && birth_date,
        types: expect.arrayContaining([
          expect.objectContaining({
            id: expect.any(String) && uuidFake,
            name: expect.any(String) && types[0].name,
            description: expect.any(String || null) && types[0].description,
          }),
        ]),
      })
    );
  });

  it("not should able to create user already email exist", async () => {
    // arrange
    const [
      { name, last_name, cpf, rg, email, birth_date, password_hash },
    ] = usersFactory.generate({ quantity: 1 });
    const uuidFake = faker.datatype.uuid();

    usersRepositoryMock.findUserByEmailCpfRg.mockResolvedValue({
      id: uuidFake,
      name,
      last_name,
      cpf,
      rg,
      email,
      birth_date,
      password_hash,
    });

    // act
    // assert
    await expect(
      createUserService.execute({
        name,
        last_name,
        cpf,
        rg,
        email,
        birth_date,
        password: password_hash,
      })
    ).rejects.toEqual(new AppError({ message: "User client already exist" }));

    expect(usersRepositoryMock.findUserByEmailCpfRg).toHaveBeenCalledWith({
      cpf,
      rg,
      email,
    });
  });
});
