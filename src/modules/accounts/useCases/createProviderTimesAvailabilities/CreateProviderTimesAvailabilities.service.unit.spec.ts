import "reflect-metadata";
import { faker } from "@faker-js/faker/locale/pt_BR";
import { providersRepositoryMock } from "@modules/accounts/repositories/mocks/Providers.repository.mock";
import { usersRepositoryMock } from "@modules/accounts/repositories/mocks/Users.repository.mock";
import { CreateProviderTimesAvailabilitiesService } from "@modules/accounts/useCases/createProviderTimesAvailabilities/CreateProviderTimesAvailabilities.service";
import { TermsAcceptUserService } from "@modules/accounts/useCases/termsAcceptsUser/TermsAcceptsUser.service";
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

let createProviderTimesAvailabilitiesService: CreateProviderTimesAvailabilitiesService;

const mockedDate = new Date("2020-09-01T09:33:37");

jest.mock("uuid");
jest.useFakeTimers("modern").setSystemTime(mockedDate.getTime());

describe("CreateProviderTimesAvailabilitiesService", () => {
  const usersFactory = new UsersFactory();
  const usersTypesFactory = new UsersTypesFactory();
  const addressesFactory = new AddressesFactory();
  const phonesFactory = new PhonesFactory();
  const imageProfileFactory = new ImagesFactory();
  const usersTermsFactory = new UsersTermsFactory();

  beforeEach(() => {
    createProviderTimesAvailabilitiesService =
      new CreateProviderTimesAvailabilitiesService(providersRepositoryMock);
  });

  it("Should be able to accept create provider times user", async () => {
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
    providersRepositoryMock.createTimesAvailable.mockResolvedValue({});
    const times = [
      {
        start_date: faker.phone.phoneNumber("##:##"),
        end_date: faker.phone.phoneNumber("##:##"),
      },
    ];
    // act
    await createProviderTimesAvailabilitiesService.execute({
      provider_id: id,
      times,
    });

    // assert
    expect(providersRepositoryMock.findById).toHaveBeenCalledWith(id);
    expect(providersRepositoryMock.createTimesAvailable).toHaveBeenCalledWith({
      provider_id: id,
      times,
    });
  });

  it("Not should able to accept terms create provider times not exist", async () => {
    // arrange
    const [{ id }] = usersFactory.generate({
      quantity: 1,
      id: "true",
    });
    usersRepositoryMock.findById.mockResolvedValue(undefined);
    const times = [
      {
        start_date: faker.phone.phoneNumber("##:##"),
        end_date: faker.phone.phoneNumber("##:##"),
      },
    ];
    // act
    // assert
    expect.assertions(2);
    await expect(
      createProviderTimesAvailabilitiesService.execute({
        provider_id: id,
        times,
      })
    ).rejects.toEqual(new AppError(NOT_FOUND.PROVIDER_DOES_NOT_EXIST));

    expect(providersRepositoryMock.findById).toHaveBeenCalledWith(id);
  });
});
