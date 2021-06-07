import "reflect-metadata";
import faker from "faker";
import * as uuid from "uuid";

import { config } from "@config/environment";
import { usersRepositoryMock } from "@modules/accounts/repositories/mocks/UserRepository.mock";
import { usersTokensRepositoryMock } from "@modules/accounts/repositories/mocks/UsersTokensRepository.mock";
import { CreateUserClientService } from "@modules/accounts/useCases/createUserClient/CreateUserClient.service";
import { ResetPasswordService } from "@modules/accounts/useCases/resetPasswordUser/ResetPasswordUser.service";
import { dateProviderMock } from "@shared/container/providers/DateProvider/mocks/DateProvider.mock";
import { hashProviderMock } from "@shared/container/providers/HashProvider/mocks/HashProvider.mock";
import { ISendMailDTO } from "@shared/container/providers/MailProvider/dtos/ISendMailDTO";
import { MailContent } from "@shared/container/providers/MailProvider/enums/MailType.enum";
import { queueProviderMock } from "@shared/container/providers/QueueProvider/mocks/QueueProvider.mock";
import { HttpErrorCodes } from "@shared/enums/statusCode";
import { AppError } from "@shared/errors/AppError";
import {
  UsersFactory,
  UsersTypesFactory,
} from "@shared/infra/typeorm/factories";

let resetPasswordService: ResetPasswordService;
const mocked_date = new Date("2020-09-01T09:33:37");
jest.mock("uuid");
jest.useFakeTimers("modern").setSystemTime(mocked_date.getTime());

describe("ResetPasswordUser", () => {
  const usersFactory = new UsersFactory();

  beforeEach(() => {
    resetPasswordService = new ResetPasswordService(
      usersTokensRepositoryMock,
      dateProviderMock,
      usersRepositoryMock,
      hashProviderMock
    );
  });

  it("Should be able to reset password user", async () => {
    // arrange
    const [{ password_hash, id }] = usersFactory.generate({
      quantity: 1,
      active: false,
      id: "true",
    });
    const token_faker = faker.datatype.uuid();
    const id_token_fake = faker.datatype.uuid();

    usersTokensRepositoryMock.findByRefreshToken.mockResolvedValue({
      expires_date: mocked_date,
      user_id: id,
      id: id_token_fake,
    });
    dateProviderMock.compareIfBefore.mockReturnValue(false);
    hashProviderMock.generateHash.mockResolvedValue(password_hash);
    usersRepositoryMock.updatePasswordUser.mockReturnValue({});
    usersTokensRepositoryMock.deleteById.mockResolvedValue({});

    // act
    await resetPasswordService.execute({
      token: token_faker,
      password: password_hash,
    });

    // assert
    expect(usersTokensRepositoryMock.findByRefreshToken).toHaveBeenCalledWith(
      token_faker
    );
    expect(dateProviderMock.compareIfBefore).toHaveBeenCalledWith(
      mocked_date,
      mocked_date
    );
    expect(hashProviderMock.generateHash).toHaveBeenCalledWith(password_hash);
    expect(usersRepositoryMock.updatePasswordUser).toHaveBeenCalledWith({
      id,
      password_hash,
    });
    expect(usersTokensRepositoryMock.deleteById).toHaveBeenCalledWith(
      id_token_fake
    );
  });

  it("Should not be with invalid token", async () => {
    // arrange
    const [{ password_hash }] = usersFactory.generate({
      quantity: 1,
      active: false,
      id: "true",
    });
    const token_faker = faker.datatype.uuid();

    usersTokensRepositoryMock.findByRefreshToken.mockResolvedValue(undefined);

    // act
    expect.assertions(2);
    await expect(
      resetPasswordService.execute({
        token: token_faker,
        password: password_hash,
      })
    ).rejects.toEqual(new AppError({ message: "Token invalid!" }));
    // assert
    expect(usersTokensRepositoryMock.findByRefreshToken).toHaveBeenCalledWith(
      token_faker
    );
  });

  it("Should not be able to reset password user if token expire in date", async () => {
    // arrange
    const [{ password_hash, id }] = usersFactory.generate({
      quantity: 1,
      active: false,
      id: "true",
    });
    const token_faker = faker.datatype.uuid();
    const id_token_fake = faker.datatype.uuid();

    usersTokensRepositoryMock.findByRefreshToken.mockResolvedValue({
      expires_date: mocked_date,
      user_id: id,
      id: id_token_fake,
    });
    dateProviderMock.compareIfBefore.mockReturnValue(true);

    // act
    expect.assertions(3);
    await expect(
      resetPasswordService.execute({
        token: token_faker,
        password: password_hash,
      })
    ).rejects.toEqual(
      new AppError({
        message: "Token expired!",
        status_code: HttpErrorCodes.UNAUTHORIZED,
      })
    );
    // assert
    expect(usersTokensRepositoryMock.findByRefreshToken).toHaveBeenCalledWith(
      token_faker
    );
    expect(dateProviderMock.compareIfBefore).toHaveBeenCalledWith(
      mocked_date,
      mocked_date
    );
  });
  // it("Not should able to create user already email exist", async () => {
  //   // arrange
  //   const [type] = usersTypesFactory.generate("with_id");
  //   const [
  //     {
  //       name,
  //       last_name,
  //       cpf,
  //       rg,
  //       email,
  //       birth_date,
  //       password_hash,
  //       id,
  //       active,
  //     },
  //   ] = usersFactory.generate({ quantity: 1, id: "true", active: false });

  //   usersRepositoryMock.findUserByEmailCpfRg.mockResolvedValue({
  //     id,
  //     name,
  //     last_name,
  //     cpf,
  //     rg,
  //     email,
  //     birth_date,
  //     password_hash,
  //     active,
  //     types: [type],
  //     phones: [],
  //     addresses: [],
  //   });

  //   // act
  //   // assert
  //   expect.assertions(2);
  //   await expect(
  //     createUserService.execute({
  //       name,
  //       last_name,
  //       cpf,
  //       rg,
  //       email,
  //       birth_date,
  //       password: password_hash,
  //     })
  //   ).rejects.toEqual(new AppError({ message: "User client already exist" }));

  //   expect(usersRepositoryMock.findUserByEmailCpfRg).toHaveBeenCalledWith({
  //     cpf,
  //     rg,
  //     email,
  //   });
  // });
});
