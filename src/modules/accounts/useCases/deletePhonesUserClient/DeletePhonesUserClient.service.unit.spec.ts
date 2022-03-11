import "reflect-metadata";
import faker from "faker";

import auth from "@config/auth";
import { config } from "@config/environment";
import { phonesRepositoryMock } from "@modules/accounts/repositories/mocks/Phones.repository.mock";
import { usersRepositoryMock } from "@modules/accounts/repositories/mocks/Users.repository.mock";
import { usersTokensRepositoryMock } from "@modules/accounts/repositories/mocks/UsersTokens.repository.mock";
import { CreateUserPhonesClientService } from "@modules/accounts/useCases/createPhonesUserClient/CreateUserPhonesClient.service";
import { dateProviderMock } from "@shared/container/providers/DateProvider/mocks/Date.provider.mock";
import { hashProviderMock } from "@shared/container/providers/HashProvider/mocks/Hash.provider.mock";
import { jwtProviderMock } from "@shared/container/providers/JwtProvider/mocks/Jwt.provider.mock";
import { queueProviderMock } from "@shared/container/providers/QueueProvider/mocks/Queue.provider.mock";
import { SendSmsDTO } from "@shared/container/providers/SmsProvider/dtos/SendSms.dto";
import { AppError } from "@shared/errors/AppError";
import { FORBIDDEN } from "@shared/errors/constants";
import {
  PhonesFactory,
  UsersFactory,
  UsersTypesFactory,
} from "@shared/infra/typeorm/factories";

let createUserPhonesClientService: CreateUserPhonesClientService;
const mocked_date = new Date("2020-09-01T09:33:37");
jest.mock("uuid");
jest.useFakeTimers("modern").setSystemTime(mocked_date.getTime());

describe("CreateUserPhonesClientService", () => {
  const usersFactory = new UsersFactory();
  const usersTypesFactory = new UsersTypesFactory();
  const phonesFactory = new PhonesFactory();

  beforeEach(() => {
    createUserPhonesClientService = new CreateUserPhonesClientService(
      usersRepositoryMock,
      phonesRepositoryMock,
      usersTokensRepositoryMock,
      queueProviderMock,
      hashProviderMock,
      jwtProviderMock,
      dateProviderMock
    );
  });

  it("Should be able to create an user", async () => {
    // arrange
    const [
      {
        name,
        last_name,
        cpf,
        rg,
        email,
        birth_date,
        password_hash,
        active,
        id,
      },
    ] = usersFactory.generate({ quantity: 1, active: false, id: "true" });
    const [type] = usersTypesFactory.generate({});
    const [
      { country_code, ddd, id: phone_id, number },
    ] = phonesFactory.generate({
      quantity: 1,
      id: "true",
    });
    const refresh_token_faker = faker.datatype.uuid();
    const code = number.slice(-4);
    const message: SendSmsDTO = {
      to: `${country_code}${ddd}${number}`,
      from: config.application.name,
      text: `confirme seu numero com o código: ${code}`,
    };

    const messages = [];

    messages.push({ value: JSON.stringify(message) });
    phonesRepositoryMock.findPhoneUser.mockResolvedValue(undefined);
    usersRepositoryMock.createUserPhones.mockResolvedValue({
      name,
      last_name,
      cpf,
      rg,
      email,
      birth_date,
      password_hash,
      active: false,
      id,
      types: [type],
      phones: [{ country_code, ddd, id: phone_id, number }],
    });

    hashProviderMock.generateHash.mockResolvedValue(code);
    jwtProviderMock.assign.mockReturnValue(refresh_token_faker);
    dateProviderMock.addMinutes.mockReturnValue(mocked_date);
    usersTokensRepositoryMock.create.mockResolvedValue({});
    queueProviderMock.sendMessage.mockResolvedValue({});

    // act
    const result = await createUserPhonesClientService.execute({
      user_id: id,
      country_code,
      number,
      ddd,
    });

    // assert
    expect(phonesRepositoryMock.findPhoneUser).toHaveBeenCalledWith({
      ddd,
      country_code,
      number,
    });
    expect(usersRepositoryMock.createUserPhones).toHaveBeenCalledWith({
      id,
      country_code,
      number,
      ddd,
    });
    expect(hashProviderMock.generateHash).toHaveBeenCalledWith(code);

    expect(jwtProviderMock.assign).toHaveBeenCalledWith({
      payload: { email },
      secretOrPrivateKey: auth.secret.refresh,
      options: {
        expiresIn: auth.expires_in.refresh,
        subject: { user: { id, active, types: [type] }, code_hash: code },
      },
    });
    expect(dateProviderMock.addMinutes).toHaveBeenCalledWith(
      config.sms.token.expiration_time
    );
    expect(usersTokensRepositoryMock.create).toHaveBeenCalledWith({
      refresh_token: refresh_token_faker,
      user_id: id,
      expires_date: mocked_date,
    });
    expect(queueProviderMock.sendMessage).toHaveBeenCalledWith({
      topic: config.sms.queue.topic,
      messages,
    });
    expect(result).toEqual({
      user: expect.objectContaining({
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
        phones: expect.arrayContaining([
          {
            id: expect.any(String) && phone_id,
            country_code: expect.any(String) && country_code,
            number: expect.any(String) && number,
            ddd: expect.any(String) && ddd,
          },
        ]),
      }),
      token: refresh_token_faker,
    });
  });

  it("Should not be able to create address an user", async () => {
    // arrange
    const [{ id }] = usersFactory.generate({
      quantity: 1,
      active: false,
      id: "true",
    });
    const [
      { country_code, ddd, id: phone_id, number },
    ] = phonesFactory.generate({
      quantity: 1,
      id: "true",
    });

    phonesRepositoryMock.findPhoneUser.mockResolvedValue({
      country_code,
      ddd,
      id: phone_id,
      number,
      users: [{ id }],
    });

    // act
    // assert
    expect.assertions(2);
    await expect(
      createUserPhonesClientService.execute({
        user_id: id,
        country_code,
        number,
        ddd,
      })
    ).rejects.toEqual(new AppError(FORBIDDEN.PHONE_BELONGS_TO_ANOTHER_USER));
    expect(phonesRepositoryMock.findPhoneUser).toHaveBeenCalledWith({
      ddd,
      country_code,
      number,
    });
  });
});
