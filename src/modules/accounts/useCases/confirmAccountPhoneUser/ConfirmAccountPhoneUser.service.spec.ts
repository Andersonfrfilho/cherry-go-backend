import "reflect-metadata";
import faker from "faker";

import auth from "@config/auth";
import { config } from "@config/environment";
import { usersRepositoryMock } from "@modules/accounts/repositories/mocks/UserRepository.mock";
import { usersTokensRepositoryMock } from "@modules/accounts/repositories/mocks/UsersTokensRepository.mock";
import { ConfirmAccountPhoneUserService } from "@modules/accounts/useCases/confirmAccountPhoneUser/ConfirmAccountPhoneUser.service";
import { CreateUserClientService } from "@modules/accounts/useCases/createUserClient/CreateUserClient.service";
import { dateProviderMock } from "@shared/container/providers/DateProvider/mocks/DateProvider.mock";
import { hashProviderMock } from "@shared/container/providers/HashProvider/mocks/HashProvider.mock";
import { jwtProviderMock } from "@shared/container/providers/JwtProvider/mocks/jwtProvider.mock";
import { ISendMailDTO } from "@shared/container/providers/MailProvider/dtos/ISendMailDTO";
import { MailContent } from "@shared/container/providers/MailProvider/enums/MailType.enum";
import { queueProviderMock } from "@shared/container/providers/QueueProvider/mocks/QueueProvider.mock";
import { HttpErrorCodes } from "@shared/enums/statusCode";
import { AppError } from "@shared/errors/AppError";
import {
  UsersFactory,
  UsersTypesFactory,
} from "@shared/infra/typeorm/factories";

let confirmAccountPhoneUserService: ConfirmAccountPhoneUserService;
const mocked_date = new Date("2020-09-01T09:33:37");
jest.mock("uuid");
jest.useFakeTimers("modern").setSystemTime(mocked_date.getTime());

describe("ConfirmAccountPhoneUserService", () => {
  const usersFactory = new UsersFactory();
  const usersTypesFactory = new UsersTypesFactory();

  beforeEach(() => {
    confirmAccountPhoneUserService = new ConfirmAccountPhoneUserService(
      usersRepositoryMock,
      usersTokensRepositoryMock,
      dateProviderMock,
      jwtProviderMock,
      hashProviderMock
    );
  });

  it("Should be able to create an user", async () => {
    // arrange
    const [{ id }] = usersFactory.generate({
      quantity: 1,
      active: false,
      id: "true",
    });
    const code = faker.phone.phoneNumber("####");
    const token = faker.datatype.uuid();
    const refresh_token_fake = faker.datatype.uuid();
    const user_token_id = faker.datatype.uuid();

    usersTokensRepositoryMock.findByRefreshToken.mockResolvedValue({
      refresh_token: refresh_token_fake,
      expires_date: mocked_date,
      id: user_token_id,
    });
    jwtProviderMock.verifyJwt.mockReturnValue({
      sub: { user: { id }, code_hash: code },
    });
    dateProviderMock.compareIfBefore.mockReturnValue(false);
    usersTokensRepositoryMock.deleteById.mockResolvedValue({});
    hashProviderMock.compareHash.mockResolvedValue(true);
    usersRepositoryMock.updateActivePhoneUser.mockResolvedValue({});

    // act
    await confirmAccountPhoneUserService.execute({
      code,
      token,
      user_id: id,
    });

    // assert
    expect.assertions(6);
    expect(usersTokensRepositoryMock.findByRefreshToken).toHaveBeenCalledWith(
      token
    );
    expect(jwtProviderMock.verifyJwt).toHaveBeenCalledWith({
      auth_secret: auth.secret.refresh,
      token: refresh_token_fake,
    });
    expect(dateProviderMock.compareIfBefore).toHaveBeenCalledWith(
      mocked_date,
      mocked_date
    );
    expect(usersTokensRepositoryMock.deleteById).toHaveBeenCalledWith(
      user_token_id
    );
    expect(hashProviderMock.compareHash).toHaveBeenCalledWith(code, code);
    expect(usersRepositoryMock.updateActivePhoneUser).toHaveBeenCalledWith({
      user_id: id,
      active: true,
    });
  });

  it("Should not be confirm account phone when id difference decrypt id token", async () => {
    // arrange
    const [{ id }] = usersFactory.generate({
      quantity: 1,
      active: false,
      id: "true",
    });
    const [{ id: idOtherUser }] = usersFactory.generate({
      quantity: 1,
      active: false,
      id: "true",
    });
    const code = faker.phone.phoneNumber("####");
    const token = faker.datatype.uuid();
    const refresh_token_fake = faker.datatype.uuid();
    const user_token_id = faker.datatype.uuid();

    usersTokensRepositoryMock.findByRefreshToken.mockResolvedValue({
      refresh_token: refresh_token_fake,
      expires_date: mocked_date,
      id: user_token_id,
    });
    jwtProviderMock.verifyJwt.mockReturnValue({
      sub: { user: { id: idOtherUser }, code_hash: code },
    });

    // act
    // assert
    expect.assertions(3);
    await expect(
      confirmAccountPhoneUserService.execute({
        code,
        token,
        user_id: id,
      })
    ).rejects.toEqual(
      new AppError({
        message: "Not authorized!",
        status_code: HttpErrorCodes.CONFLICT,
      })
    );
    expect(usersTokensRepositoryMock.findByRefreshToken).toHaveBeenCalledWith(
      token
    );
    expect(jwtProviderMock.verifyJwt).toHaveBeenCalledWith({
      auth_secret: auth.secret.refresh,
      token: refresh_token_fake,
    });
  });

  it("Should not be able by invalid date", async () => {
    // arrange
    const [{ id }] = usersFactory.generate({
      quantity: 1,
      active: false,
      id: "true",
    });
    const code = faker.phone.phoneNumber("####");
    const token = faker.datatype.uuid();
    const refresh_token_fake = faker.datatype.uuid();
    const user_token_id = faker.datatype.uuid();

    usersTokensRepositoryMock.findByRefreshToken.mockResolvedValue({
      refresh_token: refresh_token_fake,
      expires_date: mocked_date,
      id: user_token_id,
    });
    jwtProviderMock.verifyJwt.mockReturnValue({
      sub: { user: { id }, code_hash: code },
    });
    dateProviderMock.compareIfBefore.mockReturnValue(true);

    // act
    // assert
    expect.assertions(4);
    await expect(
      confirmAccountPhoneUserService.execute({
        code,
        token,
        user_id: id,
      })
    ).rejects.toEqual(
      new AppError({
        message: "Token expired!",
        status_code: HttpErrorCodes.UNAUTHORIZED,
      })
    );

    expect(usersTokensRepositoryMock.findByRefreshToken).toHaveBeenCalledWith(
      token
    );
    expect(jwtProviderMock.verifyJwt).toHaveBeenCalledWith({
      auth_secret: auth.secret.refresh,
      token: refresh_token_fake,
    });
    expect(dateProviderMock.compareIfBefore).toHaveBeenCalledWith(
      mocked_date,
      mocked_date
    );
  });
  it("Should not confirm phone number user if code incorrect", async () => {
    // arrange
    const [{ id }] = usersFactory.generate({
      quantity: 1,
      active: false,
      id: "true",
    });
    const code = faker.phone.phoneNumber("####");
    const token = faker.datatype.uuid();
    const refresh_token_fake = faker.datatype.uuid();
    const user_token_id = faker.datatype.uuid();

    usersTokensRepositoryMock.findByRefreshToken.mockResolvedValue({
      refresh_token: refresh_token_fake,
      expires_date: mocked_date,
      id: user_token_id,
    });
    jwtProviderMock.verifyJwt.mockReturnValue({
      sub: { user: { id }, code_hash: code },
    });
    dateProviderMock.compareIfBefore.mockReturnValue(false);
    usersTokensRepositoryMock.deleteById.mockResolvedValue({});
    hashProviderMock.compareHash.mockResolvedValue(false);

    // act

    // assert
    expect.assertions(6);
    await expect(
      confirmAccountPhoneUserService.execute({
        code,
        token,
        user_id: id,
      })
    ).rejects.toEqual(
      new AppError({
        message: "Code incorrect!",
        status_code: HttpErrorCodes.CONFLICT,
      })
    );
    expect(usersTokensRepositoryMock.findByRefreshToken).toHaveBeenCalledWith(
      token
    );
    expect(jwtProviderMock.verifyJwt).toHaveBeenCalledWith({
      auth_secret: auth.secret.refresh,
      token: refresh_token_fake,
    });
    expect(dateProviderMock.compareIfBefore).toHaveBeenCalledWith(
      mocked_date,
      mocked_date
    );
    expect(usersTokensRepositoryMock.deleteById).toHaveBeenCalledWith(
      user_token_id
    );
    expect(hashProviderMock.compareHash).toHaveBeenCalledWith(code, code);
  });
});
