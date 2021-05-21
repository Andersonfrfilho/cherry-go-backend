import auth from "@config/auth";
import { UsersRepositoryInMemory } from "@modules/accounts/repositories/in-memory/UserRepositoryInMemory";
import { UsersTokensRepositoryInMemory } from "@modules/accounts/repositories/in-memory/UsersTokensRepositoryInMemory";
import { IUsersRepository } from "@modules/accounts/repositories/IUsersRepository";
import { IUsersTokensRepository } from "@modules/accounts/repositories/IUsersTokensRepository";
import { AuthenticateUserService } from "@modules/accounts/useCases/authenticateUser/AuthenticateUser.service";
import { CreateUserClientService } from "@modules/accounts/useCases/createUserClient/CreateUserClient.service";
import { RefreshTokenService } from "@modules/accounts/useCases/refreshToken/RefreshToken.service";
import { IDateProvider } from "@shared/container/providers/DateProvider/IDateProvider";
import { DateFnsProvider } from "@shared/container/providers/DateProvider/implementations/DateFnsProvider";
import { IHashProvider } from "@shared/container/providers/HashProvider/IHashProvider";
import { HashProviderInMemory } from "@shared/container/providers/HashProvider/in-memory/HashProviderInMemory";
import { IJwtProvider } from "@shared/container/providers/JwtProvider/IJwtProvider";
import { JwtProviderInMemory } from "@shared/container/providers/JwtProvider/in-memory/JwtProviderInMemory";
import { AppError } from "@shared/errors/AppError";
import { UsersFactory } from "@shared/infra/typeorm/factories";

let usersTokensRepositoryInMemory: IUsersTokensRepository;
let usersRepositoryInMemory: IUsersRepository;
let createUserService: CreateUserClientService;
let hashProviderInMemory: IHashProvider;
let dateProviderInMemory: IDateProvider;
let authenticateUserService: AuthenticateUserService;
let jwtProviderInMemory: IJwtProvider;
let refreshTokenService: RefreshTokenService;

describe("Refresh token service", () => {
  const usersFactory = new UsersFactory();

  beforeEach(() => {
    usersRepositoryInMemory = new UsersRepositoryInMemory();
    hashProviderInMemory = new HashProviderInMemory();
    createUserService = new CreateUserClientService(
      usersRepositoryInMemory,
      hashProviderInMemory
    );
    usersTokensRepositoryInMemory = new UsersTokensRepositoryInMemory();
    dateProviderInMemory = new DateFnsProvider();
    authenticateUserService = new AuthenticateUserService(
      usersRepositoryInMemory,
      usersTokensRepositoryInMemory,
      hashProviderInMemory,
      dateProviderInMemory
    );
    jwtProviderInMemory = new JwtProviderInMemory();
    refreshTokenService = new RefreshTokenService(
      usersTokensRepositoryInMemory,
      dateProviderInMemory,
      jwtProviderInMemory
    );
  });

  it("should be able to create an new token", async () => {
    // arrange
    const { expires_in } = auth;

    const jwtProviderVerifyJwt = jest.spyOn(jwtProviderInMemory, "verifyJwt");
    const usersTokensRepositoryFindByUserIdAndRefreshToken = jest.spyOn(
      usersTokensRepositoryInMemory,
      "findByUserIdAndRefreshToken"
    );
    const usersTokensRepositoryDeleteById = jest.spyOn(
      usersTokensRepositoryInMemory,
      "deleteById"
    );
    const dateProviderAddDays = jest.spyOn(dateProviderInMemory, "addDays");
    const jwtProviderInMemoryAssign = jest.spyOn(jwtProviderInMemory, "assign");
    const usersTokensRepositoryCreate = jest.spyOn(
      usersTokensRepositoryInMemory,
      "create"
    );

    const [
      { name, last_name, cpf, rg, email, birth_date, password_hash },
    ] = usersFactory.generate({
      quantity: 1,
      active: true,
    });

    // act
    await createUserService.execute({
      name,
      last_name,
      cpf,
      rg,
      email,
      birth_date,
      password: password_hash,
    });

    // assert
    const {
      refresh_token,
      user: { id },
    } = await authenticateUserService.execute({
      email,
      password: password_hash,
    });

    const response = await refreshTokenService.execute(
      JSON.stringify({
        refresh_token,
        email,
        id,
      })
    );

    expect(jwtProviderVerifyJwt).toHaveBeenCalledWith({
      auth_secret: auth.secret.refresh,
      token: JSON.stringify({
        refresh_token,
        email,
        id,
      }),
    });
    expect(
      usersTokensRepositoryFindByUserIdAndRefreshToken
    ).toHaveBeenCalledWith(
      id,
      JSON.stringify({
        refresh_token,
        email,
        id,
      })
    );
    expect(usersTokensRepositoryDeleteById).toHaveBeenCalled();
    expect(jwtProviderInMemoryAssign).toHaveBeenCalled();
    expect(dateProviderAddDays).toHaveBeenCalledWith(expires_in.refresh_days);
    expect(usersTokensRepositoryCreate).toHaveBeenCalled();
    expect(jwtProviderInMemoryAssign).toHaveBeenCalled();
    expect(response).toEqual(
      expect.objectContaining({
        refresh_token: expect.any(String),
        token: expect.any(String),
      })
    );
  });
  it("should not be able to create token, if token not exist", async () => {
    // arrange
    const jwtProviderVerifyJwt = jest.spyOn(jwtProviderInMemory, "verifyJwt");
    const usersTokensRepositoryFindByUserIdAndRefreshToken = jest.spyOn(
      usersTokensRepositoryInMemory,
      "findByUserIdAndRefreshToken"
    );

    const [
      { name, last_name, cpf, rg, email, birth_date, password_hash },
    ] = usersFactory.generate({
      quantity: 1,
      active: true,
    });

    // act
    await createUserService.execute({
      name,
      last_name,
      cpf,
      rg,
      email,
      birth_date,
      password: password_hash,
    });

    // assert
    const {
      token,
      user: { id },
    } = await authenticateUserService.execute({
      email,
      password: password_hash,
    });

    await expect(
      refreshTokenService.execute(
        JSON.stringify({
          refresh_token: token,
          email,
          id,
        })
      )
    ).rejects.toEqual(
      new AppError({ message: "Refresh Token does not exists!" })
    );
    expect(jwtProviderVerifyJwt).toHaveBeenCalledWith({
      auth_secret: auth.secret.refresh,
      token: JSON.stringify({
        refresh_token: token,
        email,
        id,
      }),
    });
    expect(
      usersTokensRepositoryFindByUserIdAndRefreshToken
    ).toHaveBeenCalledWith(
      id,
      JSON.stringify({
        refresh_token: token,
        email,
        id,
      })
    );
  });
});
