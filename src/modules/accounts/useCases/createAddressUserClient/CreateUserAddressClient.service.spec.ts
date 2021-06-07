import "reflect-metadata";

import { usersRepositoryMock } from "@modules/accounts/repositories/mocks/UsersRepository.mock";
import { CreateUserAddressClientService } from "@modules/accounts/useCases/createAddressUserClient/CreateUserAddressClient.service";
import { AppError } from "@shared/errors/AppError";
import {
  AddressesFactory,
  PhonesFactory,
  UsersFactory,
  UsersTypesFactory,
} from "@shared/infra/typeorm/factories";

let createUserAddressClientService: CreateUserAddressClientService;
const mocked_date = new Date("2020-09-01T09:33:37");
jest.mock("uuid");
jest.useFakeTimers("modern").setSystemTime(mocked_date.getTime());

describe("CreateUserAddressClientService", () => {
  const usersFactory = new UsersFactory();
  const usersTypesFactory = new UsersTypesFactory();
  const phonesFactory = new PhonesFactory();
  const addressesFactory = new AddressesFactory();

  beforeEach(() => {
    createUserAddressClientService = new CreateUserAddressClientService(
      usersRepositoryMock
    );
  });

  it("Should be able to create an address for user", async () => {
    // arrange
    const [
      {
        name,
        last_name,
        cpf,
        rg,
        email,
        birth_date,
        password_hash,
        active,
        id,
      },
    ] = usersFactory.generate({ quantity: 1, active: false, id: "true" });
    const [type] = usersTypesFactory.generate("with_id");
    const [phone] = phonesFactory.generate({ quantity: 1, id: "true" });
    const [
      {
        id: address_id,
        city,
        country,
        district,
        number,
        state,
        street,
        zipcode,
      },
    ] = addressesFactory.generate({ quantity: 1, id: "true" });

    usersRepositoryMock.findById.mockResolvedValue({
      id,
      name,
      last_name,
      cpf,
      rg,
      email,
      birth_date,
      password_hash,
      active,
      types: [type],
      phones: [phone],
    });
    usersRepositoryMock.createUserAddress.mockResolvedValue({
      id,
      name,
      last_name,
      cpf,
      rg,
      email,
      birth_date,
      password_hash,
      active,
      types: [type],
      phones: [phone],
      addresses: [
        {
          id: address_id,
          city,
          country,
          district,
          number,
          state,
          street,
          zipcode,
        },
      ],
    });

    // act
    const result = await createUserAddressClientService.execute({
      user_id: id,
      city,
      country,
      district,
      number,
      state,
      street,
      zipcode,
    });

    // assert
    expect(usersRepositoryMock.findById).toHaveBeenCalledWith(id);
    expect(usersRepositoryMock.createUserAddress).toHaveBeenCalledWith({
      user: {
        id,
        name,
        last_name,
        cpf,
        rg,
        email,
        birth_date,
        password_hash,
        active,
        types: [type],
        phones: [phone],
      },
      city,
      country,
      district,
      number,
      state,
      street,
      zipcode,
    });

    expect(result).toEqual(
      expect.objectContaining({
        id: expect.any(String) && id,
        name: expect.any(String) && name,
        last_name: expect.any(String) && last_name,
        cpf: expect.any(String) && cpf,
        rg: expect.any(String) && rg,
        email: expect.any(String) && email,
        password_hash: expect.any(String) && password_hash,
        birth_date: expect.any(Date) && birth_date,
        active: expect.any(Boolean) && active,
        types: expect.arrayContaining([
          expect.objectContaining({
            id: expect.any(String) && type.id,
            name: expect.any(String) && type.name,
            description: expect.any(String || null) && type.description,
          }),
        ]),
        phones: expect.arrayContaining([
          expect.objectContaining({
            id: expect.any(String) && phone.id,
            country_code: expect.any(String) && phone.country_code,
            ddd: expect.any(String) && phone.ddd,
            number: expect.any(String) && phone.number,
          }),
        ]),
        addresses: expect.arrayContaining([
          expect.objectContaining({
            id: expect.any(String) && address_id,
            city: expect.any(String) && city,
            country: expect.any(String) && country,
            district: expect.any(String) && district,
            number: expect.any(String) && number,
            state: expect.any(String) && state,
            street: expect.any(String) && street,
            zipcode: expect.any(String) && zipcode,
          }),
        ]),
      })
    );
  });

  it("Not should able to create user already email exist", async () => {
    // arrange
    const [{ id }] = usersFactory.generate({
      quantity: 1,
      active: false,
      id: "true",
    });
    const [
      { city, country, district, number, state, street, zipcode },
    ] = addressesFactory.generate({ quantity: 1 });

    usersRepositoryMock.findById.mockResolvedValue(undefined);

    // act
    // assert
    expect.assertions(2);
    await expect(
      createUserAddressClientService.execute({
        user_id: id,
        city,
        country,
        district,
        number,
        state,
        street,
        zipcode,
      })
    ).rejects.toEqual(new AppError({ message: "User client not exist" }));

    expect(usersRepositoryMock.findById).toHaveBeenCalledWith(id);
  });
});
