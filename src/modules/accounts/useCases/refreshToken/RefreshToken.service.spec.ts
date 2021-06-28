import "reflect-metadata";
import faker from "faker";

import auth from "@config/auth";
import { usersTokensRepositoryMock } from "@modules/accounts/repositories/mocks/UsersTokensRepository.mock";
import { dateProviderMock } from "@shared/container/providers/DateProvider/mocks/DateProvider.mock";
import { jwtProviderMock } from "@shared/container/providers/JwtProvider/mocks/jwtProvider.mock";
import { AppError } from "@shared/errors/AppError";
import { FORBIDDEN } from "@shared/errors/constants";
import { UsersFactory } from "@shared/infra/typeorm/factories";

import { RefreshTokenService } from "./RefreshToken.service";

let refreshTokenService: RefreshTokenService;
const mocked_date = new Date("2020-09-01T09:33:37");
jest.mock("uuid");
jest.useFakeTimers("modern").setSystemTime(mocked_date.getTime());

describe("RefreshTokenService", () => {
  const usersFactory = new UsersFactory();

  beforeEach(() => {
    refreshTokenService = new RefreshTokenService(
      usersTokensRepositoryMock,
      dateProviderMock,
      jwtProviderMock
    );
  });

  it("Should be able to create an user", async () => {
    // arrange
    const [{ email, id }] = usersFactory.generate({
      quantity: 1,
      active: false,
      id: "true",
    });
    const token = faker.datatype.uuid();
    const id_token_faker = faker.datatype.uuid();
    const refresh_token_faker = faker.datatype.uuid();
    const new_refresh_token_faker = faker.datatype.uuid();

    jwtProviderMock.verifyJwt.mockReturnValue({
      email,
      sub: { user: { id } },
    });
    usersTokensRepositoryMock.findByUserIdAndRefreshToken.mockResolvedValue({
      id: id_token_faker,
    });
    usersTokensRepositoryMock.deleteById.mockResolvedValue({});
    jwtProviderMock.assign
      .mockReturnValueOnce(refresh_token_faker)
      .mockReturnValueOnce(new_refresh_token_faker);
    dateProviderMock.addDays.mockReturnValue(mocked_date);
    usersTokensRepositoryMock.create.mockResolvedValue({});

    // act
    const result = await refreshTokenService.execute(token);

    // assert
    expect(jwtProviderMock.verifyJwt).toHaveBeenCalledWith({
      auth_secret: auth.secret.refresh,
      token,
    });
    expect(
      usersTokensRepositoryMock.findByUserIdAndRefreshToken
    ).toHaveBeenCalledWith(id, token);
    expect(usersTokensRepositoryMock.deleteById).toHaveBeenCalledWith(
      id_token_faker
    );
    expect(jwtProviderMock.assign).toHaveBeenNthCalledWith(1, {
      payload: { email },
      secretOrPrivateKey: auth.secret.refresh,
      options: {
        expiresIn: auth.expires_in.refresh,
        subject: { user: { id } },
      },
    });
    expect(dateProviderMock.addDays).toHaveBeenCalledWith(
      auth.expires_in.refresh_days
    );
    expect(usersTokensRepositoryMock.create).toHaveBeenCalledWith({
      expires_date: mocked_date,
      refresh_token: refresh_token_faker,
      user_id: id,
    });
    expect(jwtProviderMock.assign).toHaveBeenNthCalledWith(2, {
      payload: {},
      secretOrPrivateKey: auth.secret.token,
      options: {
        expiresIn: auth.expires_in.token,
        subject: { user: { id } },
      },
    });
    expect(result).toEqual(
      expect.objectContaining({
        token: expect.any(String) && token,
        refresh_token: expect.any(String) && new_refresh_token_faker,
      })
    );
  });

  it("Should be able to create an user", async () => {
    // arrange
    const [{ email, id }] = usersFactory.generate({
      quantity: 1,
      active: false,
      id: "true",
    });
    const token = faker.datatype.uuid();

    jwtProviderMock.verifyJwt.mockReturnValue({
      email,
      sub: { user: { id } },
    });
    usersTokensRepositoryMock.findByUserIdAndRefreshToken.mockResolvedValue(
      undefined
    );

    // act
    expect.assertions(3);
    await expect(refreshTokenService.execute(token)).rejects.toEqual(
      new AppError(FORBIDDEN.REFRESH_TOKEN_DOES_NOT_EXIST)
    );
    // assert
    expect(jwtProviderMock.verifyJwt).toHaveBeenCalledWith({
      auth_secret: auth.secret.refresh,
      token,
    });
    expect(
      usersTokensRepositoryMock.findByUserIdAndRefreshToken
    ).toHaveBeenCalledWith(id, token);
  });
});
