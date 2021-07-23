import "reflect-metadata";

import { usersRepositoryMock } from "@modules/accounts/repositories/mocks/Users.repository.mock";
import { CreateUsersTypeProvidersService } from "@modules/accounts/useCases/createUsersTypeProviders/CreateUsersTypeProviders.service";
import { AppError } from "@shared/errors/AppError";
import { NOT_FOUND } from "@shared/errors/constants";
import {
  AddressesFactory,
  ImagesFactory,
  PhonesFactory,
  UsersFactory,
  UsersTypesFactory,
  UsersTermsFactory,
} from "@shared/infra/typeorm/factories";

let createUsersTypeProvidersService: CreateUsersTypeProvidersService;

const mockedDate = new Date("2020-09-01T09:33:37");

jest.mock("uuid");
jest.useFakeTimers("modern").setSystemTime(mockedDate.getTime());

describe("CreateUsersTypeProvidersService", () => {
  const usersFactory = new UsersFactory();
  const usersTypesFactory = new UsersTypesFactory();
  const addressesFactory = new AddressesFactory();
  const phonesFactory = new PhonesFactory();
  const imageProfileFactory = new ImagesFactory();
  const usersTermsFactory = new UsersTermsFactory();

  beforeEach(() => {
    createUsersTypeProvidersService = new CreateUsersTypeProvidersService(
      usersRepositoryMock
    );
  });

  it("Should be able to create providers type user", async () => {
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
    const [address] = addressesFactory.generate({ quantity: 1, id: "true" });
    const [image_profile] = imageProfileFactory.generate({
      quantity: 1,
      id: "true",
    });
    const [term] = usersTermsFactory.generate({ quantity: 1, accept: true });

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
      phones: [phone],
      addresses: [address],
      types: [type],
      image_profile: [{ image: image_profile }],
      term: [term],
    });
    usersRepositoryMock.acceptTerms.mockResolvedValue({});

    // act
    await createUsersTypeProvidersService.execute(id);

    // assert
    expect(usersRepositoryMock.findById).toHaveBeenCalledWith(id);
    expect(usersRepositoryMock.providerTypeForUser).toHaveBeenCalledWith({
      active: true,
      user_id: id,
    });
  });

  it("Not should able to create providers type not exist", async () => {
    // arrange
    const [{ id }] = usersFactory.generate({
      quantity: 1,
      id: "true",
    });
    usersRepositoryMock.findById.mockResolvedValue(undefined);

    // act
    // assert
    expect.assertions(2);
    await expect(createUsersTypeProvidersService.execute(id)).rejects.toEqual(
      new AppError(NOT_FOUND.USER_DOES_NOT_EXIST)
    );

    expect(usersRepositoryMock.findById).toHaveBeenCalledWith(id);
  });
});
