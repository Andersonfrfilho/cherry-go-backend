import "reflect-metadata";

import { providersRepositoryMock } from "@modules/accounts/repositories/mocks/Providers.repository.mock";
import { CreateAddressUserProviderService } from "@modules/accounts/useCases/createAddressUserProvider/CreateAddressUserProvider.service";
import { AppError } from "@shared/errors/AppError";
import { NOT_FOUND } from "@shared/errors/constants";
import {
  AddressesFactory,
  PhonesFactory,
  UsersFactory,
  UsersTypesFactory,
  UsersTermsFactory,
} from "@shared/infra/typeorm/factories";

let createUserAddressProviderService: CreateAddressUserProviderService;
const mocked_date = new Date("2020-09-01T09:33:37");
jest.mock("uuid");
jest.useFakeTimers("modern").setSystemTime(mocked_date.getTime());

describe("CreateUserAddressProviderService", () => {
  const usersFactory = new UsersFactory();
  const usersTypesFactory = new UsersTypesFactory();
  const phonesFactory = new PhonesFactory();
  const addressesFactory = new AddressesFactory();
  const usersTermsFactory = new UsersTermsFactory();

  beforeEach(() => {
    createUserAddressProviderService = new CreateAddressUserProviderService(
      providersRepositoryMock
    );
  });

  it("Should be able to create an address for user provider", async () => {
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
        id,
        active,
      },
    ] = usersFactory.generate({ quantity: 1, id: "true", active: true });
    const [type] = usersTypesFactory.generate({});
    const [phone] = phonesFactory.generate({ quantity: 1, id: "true" });
    const [term] = usersTermsFactory.generate({ quantity: 1, accept: true });
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
        latitude,
        longitude,
      },
    ] = addressesFactory.generate({ quantity: 1, id: "true" });
    providersRepositoryMock.findById.mockResolvedValue({
      id,
      name,
      last_name,
      cpf,
      rg,
      email,
      birth_date,
      password_hash,
      active,
      phones: [phone],
      addresses: [],
      types: [type],
      image_profile: [],
      term: [term],
    });

    providersRepositoryMock.createAddressProviders.mockResolvedValue({});

    // act
    await createUserAddressProviderService.execute({
      provider_id: id,
      city,
      country,
      district,
      number,
      state,
      street,
      zipcode,
      latitude,
      longitude,
    });

    // assert
    expect(providersRepositoryMock.findById).toHaveBeenCalledWith(id);
    expect(providersRepositoryMock.createAddressProviders).toHaveBeenCalledWith(
      {
        provider_id: id,
        city,
        country,
        district,
        number,
        state,
        street,
        zipcode,
        latitude,
        longitude,
      }
    );
  });

  it("Not should able to create user already email exist provider", async () => {
    // arrange
    const [{ id }] = usersFactory.generate({
      quantity: 1,
      active: false,
      id: "true",
    });
    const [
      {
        city,
        country,
        district,
        number,
        state,
        street,
        zipcode,
        longitude,
        latitude,
      },
    ] = addressesFactory.generate({ quantity: 1 });

    providersRepositoryMock.findById.mockResolvedValue(undefined);

    // act
    // assert
    expect.assertions(2);
    await expect(
      createUserAddressProviderService.execute({
        provider_id: id,
        city,
        country,
        district,
        number,
        state,
        street,
        zipcode,
        latitude,
        longitude,
      })
    ).rejects.toEqual(new AppError(NOT_FOUND.USER_DOES_NOT_EXIST));

    expect(providersRepositoryMock.findById).toHaveBeenCalledWith(id);
  });
});
