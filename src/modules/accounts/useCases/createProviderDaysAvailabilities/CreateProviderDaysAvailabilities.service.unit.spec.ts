import "reflect-metadata";

import { DAYS_WEEK_ENUM } from "@modules/accounts/enums/DaysProviders.enum";
import { providersRepositoryMock } from "@modules/accounts/repositories/mocks/Providers.repository.mock";
import { usersRepositoryMock } from "@modules/accounts/repositories/mocks/Users.repository.mock";
import { CreateProviderDaysAvailabilitiesService } from "@modules/accounts/useCases/createProviderDaysAvailabilities/CreateProviderDaysAvailabilities.service";
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

let createProviderDaysAvailabilitiesService: CreateProviderDaysAvailabilitiesService;

const mockedDate = new Date("2020-09-01T09:33:37");
const { FRIDAY, MONDAY, SATURDAY, SUNDAY, THURSDAY, TUESDAY } = DAYS_WEEK_ENUM;
jest.mock("uuid");
jest.useFakeTimers("modern").setSystemTime(mockedDate.getTime());

describe("CreateProviderDaysAvailabilitiesService", () => {
  const usersFactory = new UsersFactory();
  const usersTypesFactory = new UsersTypesFactory();
  const addressesFactory = new AddressesFactory();
  const phonesFactory = new PhonesFactory();
  const imageProfileFactory = new ImagesFactory();
  const usersTermsFactory = new UsersTermsFactory();

  beforeEach(() => {
    createProviderDaysAvailabilitiesService = new CreateProviderDaysAvailabilitiesService(
      providersRepositoryMock
    );
  });

  it("Should be able to create providers days", async () => {
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
    providersRepositoryMock.createDaysAvailable.mockResolvedValue({});

    // act
    await createProviderDaysAvailabilitiesService.execute({
      provider_id: id,
      days: [FRIDAY, MONDAY, SATURDAY, SUNDAY, THURSDAY, TUESDAY],
    });

    // assert
    expect(providersRepositoryMock.findById).toHaveBeenCalledWith(id);
    expect(providersRepositoryMock.createDaysAvailable).toHaveBeenCalledWith({
      provider_id: id,
      days: [FRIDAY, MONDAY, SATURDAY, SUNDAY, THURSDAY, TUESDAY],
    });
  });

  it("Not should able to accept terms user provider days not exist", async () => {
    // arrange
    const [{ id }] = usersFactory.generate({
      quantity: 1,
      id: "true",
    });

    providersRepositoryMock.findById.mockResolvedValue(undefined);

    // act
    // assert
    expect.assertions(2);
    await expect(
      createProviderDaysAvailabilitiesService.execute({
        provider_id: id,
        days: [FRIDAY, MONDAY, SATURDAY, SUNDAY, THURSDAY, TUESDAY],
      })
    ).rejects.toEqual(new AppError(NOT_FOUND.PROVIDER_DOES_NOT_EXIST));

    expect(providersRepositoryMock.findById).toHaveBeenCalledWith(id);
  });
});
