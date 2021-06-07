import "reflect-metadata";
import faker from "faker";
import * as uuid from "uuid";

import { config } from "@config/environment";
import { usersRepositoryMock } from "@modules/accounts/repositories/mocks/UsersRepository.mock";
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
const mocked_date = new Date("2020-09-01T09:33:37");
jest.mock("uuid");
jest.useFakeTimers("modern").setSystemTime(mocked_date.getTime());

describe("CreateUserClientService", () => {
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

  it("Should be able to create an user", async () => {
    // arrange
    const [
      { name, last_name, cpf, rg, email, birth_date, password_hash, id },
    ] = usersFactory.generate({ quantity: 1, active: false, id: "true" });
    const [type] = usersTypesFactory.generate("with_id");
    const uuid_fake = faker.datatype.uuid();
    const variables = {
      name,
      link: `${process.env.CONFIRM_MAIL_URL}${uuid_fake}`,
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
      id,
      name,
      last_name,
      cpf,
      rg,
      email,
      birth_date,
      active: false,
      password_hash,
      types: [type],
      phones: [],
      addresses: [],
    });
    dateProviderMock.addMinutes.mockReturnValue(mocked_date);
    jest.spyOn(uuid, "v4").mockReturnValue(uuid_fake);
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
      refresh_token: uuid_fake,
      user_id: id,
      expires_date: mocked_date,
    });

    expect(queueProviderMock.sendMessage).toHaveBeenCalledWith({
      topic: config.mail.queue.topic,
      messages,
    });
    expect(result).toEqual(
      expect.objectContaining({
        id: expect.any(String) && id,
        name: expect.any(String) && name,
        last_name: expect.any(String) && last_name,
        cpf: expect.any(String) && cpf,
        rg: expect.any(String) && rg,
        email: expect.any(String) && email,
        password_hash: expect.any(String) && password_hash,
        birth_date: expect.any(Date) && birth_date,
        active: expect.any(Boolean) && false,
        types: expect.arrayContaining([
          expect.objectContaining({
            id: expect.any(String) && type.id,
            name: expect.any(String) && type.name,
            description: expect.any(String) && type.description,
          }),
        ]),
        addresses: expect.arrayContaining([]),
        phones: expect.arrayContaining([]),
      })
    );
  });

  it("Not should able to create user already email exist", async () => {
    // arrange
    const [type] = usersTypesFactory.generate("with_id");
    const [
      { name, last_name, cpf, rg, email, birth_date, password_hash, id },
    ] = usersFactory.generate({ quantity: 1, id: "true", active: false });

    usersRepositoryMock.findUserByEmailCpfRg.mockResolvedValue({
      id,
      name,
      last_name,
      cpf,
      rg,
      email,
      birth_date,
      password_hash,
      active: false,
      types: [type],
      phones: [],
      addresses: [],
    });

    // act
    // assert
    expect.assertions(2);
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
