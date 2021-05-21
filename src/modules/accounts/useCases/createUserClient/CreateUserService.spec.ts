import { UsersRepositoryInMemory } from "@modules/accounts/repositories/in-memory/UserRepositoryInMemory";
import { CreateUserClientService } from "@modules/accounts/useCases/createUserClient/CreateUserClient.service";
import { HashProviderInMemory } from "@shared/container/providers/HashProvider/in-memory/HashProviderInMemory";
import { AppError } from "@shared/errors/AppError";
import { UsersFactory } from "@shared/infra/typeorm/factories";

let usersRepositoryInMemory: UsersRepositoryInMemory;
let createUserService: CreateUserClientService;
let hashProviderInMemory: HashProviderInMemory;

describe("Create users clients service", () => {
  const usersFactory = new UsersFactory();

  beforeEach(() => {
    usersRepositoryInMemory = new UsersRepositoryInMemory();
    hashProviderInMemory = new HashProviderInMemory();
    createUserService = new CreateUserClientService(
      usersRepositoryInMemory,
      hashProviderInMemory
    );
  });

  it("should be able to create an user", async () => {
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
    const result = await createUserService.execute({
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
    expect(result).toEqual(
      expect.objectContaining({
        name: expect.any(String),
        last_name: expect.any(String),
        cpf: expect.any(String),
        rg: expect.any(String),
        email: expect.any(String),
        password_hash: expect.any(String),
        birth_date: expect.any(Date),
      })
    );
  });

  it("not should able to create user already email exist", async () => {
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

    await expect(
      createUserService.execute({
        name,
        last_name,
        cpf,
        rg,
        email,
        birth_date,
        password: password_hash,
      })
    ).rejects.toEqual(new AppError({ message: "User client already exist" }));
    expect(usersRepositoryFindUserByEmailCpfRg).toHaveBeenCalledWith({
      cpf,
      rg,
      email,
    });
  });
});
