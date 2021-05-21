import faker from "faker";
import jsonwebtoken from "jsonwebtoken";

import { UsersRepositoryInMemory } from "@modules/accounts/repositories/in-memory/UserRepositoryInMemory";
import { UsersTokensRepositoryInMemory } from "@modules/accounts/repositories/in-memory/UsersTokensRepositoryInMemory";
import { AuthenticateUserService } from "@modules/accounts/useCases/authenticateUser/AuthenticateUser.service";
import { CreateUserClientService } from "@modules/accounts/useCases/createUserClient/CreateUserClient.service";
import { RefreshTokenService } from "@modules/accounts/useCases/refreshToken/RefreshToken.service";
import { DateFnsProvider } from "@shared/container/providers/DateProvider/implementations/DateFnsProvider";
import { HashProviderInMemory } from "@shared/container/providers/HashProvider/in-memory/HashProviderInMemory";
import { AppError } from "@shared/errors/AppError";
import { UsersFactory } from "@shared/infra/typeorm/factories";

let usersTokensRepositoryInMemory: UsersTokensRepositoryInMemory;
let usersRepositoryInMemory: UsersRepositoryInMemory;
let createUserService: CreateUserClientService;
let hashProviderInMemory: HashProviderInMemory;
let dateProviderInMemory: DateFnsProvider;
let authenticateUserService: AuthenticateUserService;
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
    refreshTokenService = new RefreshTokenService(
      usersTokensRepositoryInMemory,
      dateProviderInMemory
    );
  });

  it("should be able to create an new token", async () => {
    // arrange

    const usersRepositoryFindUserByEmailCpfRg = jest.spyOn(
      usersRepositoryInMemory,
      "findUserByEmailCpfRg"
    );
    const hashProviderGenerateHash = jest.spyOn(
      hashProviderInMemory,
      "generateHash"
    );
    const usersRepositoryCreate = jest.spyOn(usersRepositoryInMemory, "create");

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
    expect(usersRepositoryFindUserByEmailCpfRg).toHaveBeenCalledWith({
      cpf,
      rg,
      email,
    });
    expect(hashProviderGenerateHash).toHaveBeenCalledWith(password_hash);
    expect(usersRepositoryCreate).toHaveBeenCalledWith({
      name,
      last_name,
      cpf,
      rg,
      email,
      birth_date,
      password: password_hash,
    });

    const result = await authenticateUserService.execute({
      email,
      password: password_hash,
    });
    const data = { user_id: result.user.id };
    jest.spyOn(jsonwebtoken, "verify").mockImplementationOnce(() => {
      return { email, sub: `${{ user_id: result.user.id }}` };
    });

    jest.spyOn(jsonwebtoken, "sign").mockImplementationOnce(() => {
      return faker.datatype.uuid();
    });
    const response = await refreshTokenService.execute(result.refresh_token);

    expect(response).toEqual(
      expect.objectContaining({
        refresh_token: expect.any(String),
        token: expect.any(String),
      })
    );
  });

  // it("not should able to create user already email exist", async () => {
  //   // arrange
  //   const usersRepositoryFindUserByEmailCpfRg = jest.spyOn(
  //     usersRepositoryInMemory,
  //     "findUserByEmailCpfRg"
  //   );
  //   const hashProviderGenerateHash = jest.spyOn(
  //     hashProviderInMemory,
  //     "generateHash"
  //   );
  //   const usersRepositoryCreate = jest.spyOn(usersRepositoryInMemory, "create");
  //   const [
  //     { name, last_name, cpf, rg, email, birth_date, password_hash },
  //   ] = usersFactory.generate({
  //     quantity: 1,
  //     active: true,
  //   });

  //   // act
  //   await createUserService.execute({
  //     name,
  //     last_name,
  //     cpf,
  //     rg,
  //     email,
  //     birth_date,
  //     password: password_hash,
  //   });

  //   // assert
  //   expect(usersRepositoryFindUserByEmailCpfRg).toHaveBeenCalledWith({
  //     cpf,
  //     rg,
  //     email,
  //   });
  //   expect(hashProviderGenerateHash).toHaveBeenCalledWith(password_hash);
  //   expect(usersRepositoryCreate).toHaveBeenCalledWith({
  //     name,
  //     last_name,
  //     cpf,
  //     rg,
  //     email,
  //     birth_date,
  //     password: password_hash,
  //   });

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
  //   expect(usersRepositoryFindUserByEmailCpfRg).toHaveBeenCalledWith({
  //     cpf,
  //     rg,
  //     email,
  //   });
  // });
});
