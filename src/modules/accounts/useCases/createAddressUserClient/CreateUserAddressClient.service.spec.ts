import { UsersRepositoryInMemory } from "@modules/accounts/repositories/in-memory/UserRepositoryInMemory";
import { IUsersRepository } from "@modules/accounts/repositories/IUsersRepository";
import { CreateUserAddressClientService } from "@modules/accounts/useCases/createAddressUserClient/CreateUserAddressClient.service";
import { CreateUserClientService } from "@modules/accounts/useCases/createUserClient/CreateUserClient.service";
import { IHashProvider } from "@shared/container/providers/HashProvider/IHashProvider";
import { HashProviderInMemory } from "@shared/container/providers/HashProvider/in-memory/HashProviderInMemory";
import { AppError } from "@shared/errors/AppError";
import {
  UsersFactory,
  AddressesFactory,
} from "@shared/infra/typeorm/factories";

let usersRepositoryInMemory: IUsersRepository;
let createUserService: CreateUserClientService;
let createUserAddressService: CreateUserAddressClientService;
let hashProviderInMemory: IHashProvider;

describe("Create address users clients service", () => {
  const usersFactory = new UsersFactory();
  const addressesFactory = new AddressesFactory();

  beforeEach(() => {
    usersRepositoryInMemory = new UsersRepositoryInMemory();
    hashProviderInMemory = new HashProviderInMemory();
    createUserService = new CreateUserClientService(
      usersRepositoryInMemory,
      hashProviderInMemory
    );
    createUserAddressService = new CreateUserAddressClientService(
      usersRepositoryInMemory
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
    const usersRepositoryCreate = jest.spyOn(
      usersRepositoryInMemory,
      "createUserClientType"
    );
    const usersRepositoryFindById = jest.spyOn(
      usersRepositoryInMemory,
      "findById"
    );
    const usersRepositoryCreateUserAddress = jest.spyOn(
      usersRepositoryInMemory,
      "createUserAddress"
    );
    const [
      { name, last_name, cpf, rg, email, birth_date, password_hash },
    ] = usersFactory.generate({
      quantity: 1,
      active: true,
    });
    const [address] = addressesFactory.generate({
      quantity: 1,
    });
    // act
    const { id } = await createUserService.execute({
      name,
      last_name,
      cpf,
      rg,
      email,
      birth_date,
      password: password_hash,
    });

    const result = await createUserAddressService.execute({
      user_id: id,
      ...address,
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
    expect(usersRepositoryFindById).toHaveBeenCalledWith(id);
    expect(usersRepositoryCreateUserAddress).toHaveBeenCalled();
    expect(result).toEqual(
      expect.objectContaining({
        id: expect.any(String),
        name: expect.any(String),
        last_name: expect.any(String),
        cpf: expect.any(String),
        rg: expect.any(String),
        email: expect.any(String),
        password_hash: expect.any(String),
        birth_date: expect.any(Date),
        addresses: expect.arrayContaining([
          expect.objectContaining({
            id: expect.any(String),
            street: expect.any(String),
            number: expect.any(String),
            zipcode: expect.any(String),
            district: expect.any(String),
            city: expect.any(String),
            state: expect.any(String),
            country: expect.any(String),
          }),
        ]),
      })
    );
  });

  it("not should able to create user address if user is not exist", async () => {
    // arrange
    const usersRepositoryFindById = jest.spyOn(
      usersRepositoryInMemory,
      "findById"
    );

    const [address] = addressesFactory.generate({
      quantity: 1,
    });

    // assert
    await expect(
      createUserAddressService.execute({
        user_id: "id_invalid",
        ...address,
      })
    ).rejects.toEqual(new AppError({ message: "User client not exist" }));
    expect(usersRepositoryFindById).toHaveBeenCalledWith("id_invalid");
  });
});
