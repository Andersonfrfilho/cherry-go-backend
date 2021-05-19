import faker from "faker";

import { ICreateUserClientDTO } from "@modules/accounts/dtos";
import { UsersRepositoryInMemory } from "@modules/accounts/repositories/in-memory/UserRepositoryInMemory";
import { UsersTokensRepositoryInMemory } from "@modules/accounts/repositories/in-memory/UsersTokensRepositoryInMemory";
import { AuthenticateUserUseCase } from "@modules/accounts/useCases/authenticateUser/AuthenticateUserUseCase";
import { CreateUserClientService } from "@modules/accounts/useCases/createUserClient/CreateUserClient.services";
import { DateFnsProvider } from "@shared/container/providers/DateProvider/implementations/DateFnsProvider";
import { BCryptHashProvider } from "@shared/container/providers/HashProvider/implementations/BCryptHashProvider";
import { HashProviderInMemory } from "@shared/container/providers/HashProvider/in-memory/HashProviderInMemory";
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
    hashProviderInMemory = new BCryptHashProvider();
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

    expect(result).toBeCalledWith(
      expect.objectContaining({
        name: expect.any(String),
        last_name: expect.any(String),
        cpf: expect.any(String),
        rg: expect.any(String),
        email: expect.any(String),
        password: expect.any(String),
        birth_date: expect.any(Date),
      })
    );
  });

  // it("should not be able to authenticate an none existent user", async () => {
  //   await expect(
  //     authenticateUserUseCase.execute({
  //       email: "false@email.com",
  //       password: "password",
  //     })
  //   ).rejects.toEqual(new AppError("User not exist"));
  // });

  // it("should not be able to authenticate with incorrect password", async () => {
  //   const user: ICreateUserDTO = {
  //     driver_license: "000123",
  //     email: "user@test.com",
  //     password: "1234",
  //     name: "User Test",
  //   };
  //   await createUserUseCase.execute(user);
  //   await expect(
  //     authenticateUserUseCase.execute({
  //       email: user.email,
  //       password: "password",
  //     })
  //   ).rejects.toEqual(new AppError("User not exist"));
  // });
});
