import "reflect-metadata";

import { providersRepositoryMock } from "@modules/accounts/repositories/mocks/Providers.repository.mock";
import { CreateProviderTransportTypesAvailabilitiesService } from "@modules/accounts/useCases/createProviderTransportTypesAvailabilities/CreateProviderTransportTypesAvailabilities.service";
import { TRANSPORT_TYPES_ENUM } from "@modules/transports/enums/TransportsTypes.enum";
import { AppError } from "@shared/errors/AppError";
import { NOT_FOUND } from "@shared/errors/constants";
import {
  AddressesFactory,
  ImagesFactory,
  PhonesFactory,
  UsersFactory,
  UsersTypesFactory,
  UsersTermsFactory,
  TransportsTypesFactory,
} from "@shared/infra/typeorm/factories";

let createProviderTransportTypesAvailabilitiesService: CreateProviderTransportTypesAvailabilitiesService;

const mockedDate = new Date("2020-09-01T09:33:37");

jest.mock("uuid");
jest.useFakeTimers("modern").setSystemTime(mockedDate.getTime());
describe("CreateTransportTypesService", () => {
  const usersFactory = new UsersFactory();
  const usersTypesFactory = new UsersTypesFactory();
  const addressesFactory = new AddressesFactory();
  const phonesFactory = new PhonesFactory();
  const imageProfileFactory = new ImagesFactory();
  const usersTermsFactory = new UsersTermsFactory();
  const transportsTypesFactory = new TransportsTypesFactory();

  beforeEach(() => {
    createProviderTransportTypesAvailabilitiesService = new CreateProviderTransportTypesAvailabilitiesService(
      providersRepositoryMock
    );
  });

  it("Should be able to accept terms user", async () => {
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
    const transports = transportsTypesFactory.generate({});
    const [image_profile] = imageProfileFactory.generate({
      quantity: 1,
      id: "true",
    });
    const [term] = usersTermsFactory.generate({ quantity: 1, accept: true });

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
      addresses: [address],
      types: [type],
      image_profile: [{ image: image_profile }],
      term: [term],
    });

    // act
    await createProviderTransportTypesAvailabilitiesService.execute({
      provider_id: id,
      transport_types: transports,
    });

    // assert
    expect(providersRepositoryMock.findById).toHaveBeenCalledWith(id);
    expect(
      providersRepositoryMock.createTransportTypesAvailable
    ).toHaveBeenCalledWith({
      provider_id: id,
      transport_types: transports,
    });
  });

  it("Not should able to accept terms user not exist", async () => {
    // arrange
    const [{ id }] = usersFactory.generate({
      quantity: 1,
      id: "true",
    });
    const transports = transportsTypesFactory.generate({});
    providersRepositoryMock.findById.mockResolvedValue(undefined);

    // act
    // assert
    expect.assertions(2);
    await expect(
      createProviderTransportTypesAvailabilitiesService.execute({
        provider_id: id,
        transport_types: transports,
      })
    ).rejects.toEqual(new AppError(NOT_FOUND.PROVIDER_DOES_NOT_EXIST));

    expect(providersRepositoryMock.findById).toHaveBeenCalledWith(id);
  });
});
