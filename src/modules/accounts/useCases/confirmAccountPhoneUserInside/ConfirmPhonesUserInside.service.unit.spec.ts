import "reflect-metadata";
import faker from "faker";

import auth from "@config/auth";
import { usersRepositoryMock } from "@modules/accounts/repositories/mocks/Users.repository.mock";
import { usersTokensRepositoryMock } from "@modules/accounts/repositories/mocks/UsersTokens.repository.mock";
import { ConfirmAccountPhoneUserService } from "@modules/accounts/useCases/confirmAccountPhoneUser/ConfirmAccountPhoneUser.service";
import { dateProviderMock } from "@shared/container/providers/DateProvider/mocks/Date.provider.mock";
import { hashProviderMock } from "@shared/container/providers/HashProvider/mocks/Hash.provider.mock";
import { jwtProviderMock } from "@shared/container/providers/JwtProvider/mocks/Jwt.provider.mock";
import { AppError } from "@shared/errors/AppError";
import {
  METHOD_NOT_ALLOWED,
  UNAUTHORIZED,
  UNPROCESSABLE_ENTITY,
} from "@shared/errors/constants";
import { UsersFactory } from "@shared/infra/typeorm/factories";

let confirmAccountPhoneUserService: ConfirmAccountPhoneUserService;
const mocked_date = new Date("2020-09-01T09:33:37");
jest.mock("uuid");
jest.useFakeTimers("modern").setSystemTime(mocked_date.getTime());

describe("ConfirmAccountPhoneUserService", () => {
  const usersFactory = new UsersFactory();

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
      id,
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
    ).rejects.toEqual(new AppError(METHOD_NOT_ALLOWED.NOT_ALLOWED));
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
    ).rejects.toEqual(new AppError(UNAUTHORIZED.TOKEN_EXPIRED));

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
    ).rejects.toEqual(new AppError(UNPROCESSABLE_ENTITY.CODE_INCORRECT));
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
