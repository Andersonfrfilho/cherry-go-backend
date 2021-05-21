import { UsersRepositoryInMemory } from "@modules/accounts/repositories/in-memory/UserRepositoryInMemory";
import { UsersTokensRepositoryInMemory } from "@modules/accounts/repositories/in-memory/UsersTokensRepositoryInMemory";
import { AuthenticateUserService } from "@modules/accounts/useCases/authenticateUser/AuthenticateUser.service";
import { CreateUserClientService } from "@modules/accounts/useCases/createUserClient/CreateUserClient.service";
import { DateFnsProvider } from "@shared/container/providers/DateProvider/implementations/DateFnsProvider";
import { HashProviderInMemory } from "@shared/container/providers/HashProvider/in-memory/HashProviderInMemory";
import { HttpErrorCodes } from "@shared/enums/statusCode";
import { AppError } from "@shared/errors/AppError";
import { UsersFactory } from "@shared/infra/typeorm/factories";

let authenticateUserService: AuthenticateUserService;
let usersRepositoryInMemory: UsersRepositoryInMemory;
let usersTokensRepositoryInMemory: UsersTokensRepositoryInMemory;
let createUserService: CreateUserClientService;
let hashProviderInMemory: HashProviderInMemory;
let dateProviderInMemory: DateFnsProvider;

describe("Authenticate user service", () => {
  const usersFactory = new UsersFactory();

  beforeEach(() => {
    usersRepositoryInMemory = new UsersRepositoryInMemory();
    usersTokensRepositoryInMemory = new UsersTokensRepositoryInMemory();
    hashProviderInMemory = new HashProviderInMemory();
    dateProviderInMemory = new DateFnsProvider();
    authenticateUserService = new AuthenticateUserService(
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
    const [
      { name, last_name, cpf, rg, email, birth_date, password_hash },
    ] = usersFactory.generate({
      quantity: 1,
      active: true,
    });

    await createUserService.execute({
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

    expect(result).toEqual(
      expect.objectContaining({
        refresh_token: expect.any(String),
        token: expect.any(String),
        user: expect.objectContaining({
          id: expect.any(String),
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
    const [{ email, password_hash }] = usersFactory.generate({
      quantity: 1,
      active: true,
    });

    await expect(
      authenticateUserService.execute({
        email,
        password: password_hash,
      })
    ).rejects.toEqual(new AppError({ message: "User not exist" }));
  });

  it("should not be able to authenticate with incorrect password", async () => {
    const [
      { name, last_name, cpf, rg, email, birth_date, password_hash },
    ] = usersFactory.generate({
      quantity: 1,
      active: true,
    });

    await createUserService.execute({
      name,
      last_name,
      cpf,
      rg,
      email,
      birth_date,
      password: password_hash,
    });

    await expect(
      authenticateUserService.execute({
        email,
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
