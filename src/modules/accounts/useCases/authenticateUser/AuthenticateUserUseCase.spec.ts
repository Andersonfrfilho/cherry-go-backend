import faker from "faker";

import { ICreateUserClientDTO } from "@modules/accounts/dtos";
import { UsersRepositoryInMemory } from "@modules/accounts/repositories/in-memory/UserRepositoryInMemory";
import { UsersTokensRepositoryInMemory } from "@modules/accounts/repositories/in-memory/UsersTokensRepositoryInMemory";
import { AuthenticateUserUseCase } from "@modules/accounts/useCases/authenticateUser/AuthenticateUserUseCase";
import { CreateUserClientService } from "@modules/accounts/useCases/createUserClient/CreateUserClient.services";
import { DateFnsProvider } from "@shared/container/providers/DateProvider/implementations/DateFnsProvider";
import { HashProviderInMemory } from "@shared/container/providers/HashProvider/in-memory/HashProviderInMemory";
import { HttpErrorCodes } from "@shared/enums/statusCode";
import { AppError } from "@shared/errors/AppError";

let authenticateUserUseCase: AuthenticateUserUseCase;
let usersRepositoryInMemory: UsersRepositoryInMemory;
let usersTokensRepositoryInMemory: UsersTokensRepositoryInMemory;
let createUserService: CreateUserClientService;
let hashProviderInMemory: HashProviderInMemory;
let dateProviderInMemory: DateFnsProvider;

describe("Authenticate User", () => {
  beforeEach(() => {
    usersRepositoryInMemory = new UsersRepositoryInMemory();
    usersTokensRepositoryInMemory = new UsersTokensRepositoryInMemory();
    hashProviderInMemory = new HashProviderInMemory();
    dateProviderInMemory = new DateFnsProvider();
    authenticateUserUseCase = new AuthenticateUserUseCase(
      usersRepositoryInMemory,
      usersTokensRepositoryInMemory,
      hashProviderInMemory,
      dateProviderInMemory
    );
    createUserService = new CreateUserClientService(
      usersRepositoryInMemory,
      hashProviderInMemory
    );
  });

  it("should be able to authenticate an user", async () => {
    const user: ICreateUserClientDTO = {
      name: faker.name.firstName(),
      last_name: faker.name.lastName(),
      cpf: faker.random.alphaNumeric(11),
      rg: faker.random.alphaNumeric(10),
      email: faker.internet.email(),
      password: faker.random.alphaNumeric(10),
      birth_date: faker.date.past(),
    };

    await createUserService.execute(user);

    const result = await authenticateUserUseCase.execute({
      email: user.email,
      password: user.password,
    });

    expect(result).toEqual(
      expect.objectContaining({
        refresh_token: expect.any(String),
        token: expect.any(String),
        user: expect.objectContaining({
          name: expect.any(String),
          last_name: expect.any(String),
          cpf: expect.any(String),
          rg: expect.any(String),
          email: expect.any(String),
          password_hash: expect.any(String),
          birth_date: expect.any(Date),
        }),
      })
    );
  });

  it("should not be able to authenticate an none existent user", async () => {
    await expect(
      authenticateUserUseCase.execute({
        email: "false@email.com",
        password: "password",
      })
    ).rejects.toEqual(new AppError({ message: "User not exist" }));
  });

  it("should not be able to authenticate with incorrect password", async () => {
    const user: ICreateUserClientDTO = {
      name: faker.name.firstName(),
      last_name: faker.name.lastName(),
      cpf: faker.random.alphaNumeric(11),
      rg: faker.random.alphaNumeric(10),
      email: faker.internet.email(),
      password: faker.random.alphaNumeric(10),
      birth_date: faker.date.past(),
    };

    await createUserService.execute(user);

    await expect(
      authenticateUserUseCase.execute({
        email: user.email,
        password: "password",
      })
    ).rejects.toEqual(
      new AppError({
        message: "User password does match",
        status_code: HttpErrorCodes.UNAUTHORIZED,
      })
    );
  });
});
