import "reflect-metadata";

import { usersRepositoryMock } from "@modules/accounts/repositories/mocks/Users.repository.mock";
import { CreateTagsUsersClientService } from "@modules/accounts/useCases/createTagsUsersClient/CreateTagsUsersClient.service";
import { AppError } from "@shared/errors/AppError";
import { NOT_FOUND } from "@shared/errors/constants";
import {
  AddressesFactory,
  ImagesFactory,
  PhonesFactory,
  TagsFactory,
  UsersFactory,
  UsersTypesFactory,
  UsersTermsFactory,
} from "@shared/infra/typeorm/factories";

let createTagsUsersClientService: CreateTagsUsersClientService;
const mocked_date = new Date("2020-09-01T09:33:37");
jest.mock("uuid");
jest.useFakeTimers("modern").setSystemTime(mocked_date.getTime());

describe("CreateTagsUsersClientService", () => {
  const usersFactory = new UsersFactory();
  const usersTypesFactory = new UsersTypesFactory();
  const phonesFactory = new PhonesFactory();
  const addressesFactory = new AddressesFactory();
  const imageProfileFactory = new ImagesFactory();
  const usersTermsFactory = new UsersTermsFactory();
  const tagsFactory = new TagsFactory();

  beforeEach(() => {
    createTagsUsersClientService = new CreateTagsUsersClientService(
      usersRepositoryMock
    );
  });

  it("Should be able to create a tag user front", async () => {
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
    const [tag] = tagsFactory.generate({
      quantity: 3,
      id: "true",
      active: true,
    });

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
    usersRepositoryMock.createTagsUsersClient.mockResolvedValue({});

    // act
    await createTagsUsersClientService.execute({ tags: [tag], client_id: id });

    // assert
    expect(usersRepositoryMock.findById).toHaveBeenCalledWith(id);
    expect(usersRepositoryMock.createTagsUsersClient).toHaveBeenCalledWith({
      tags: [tag],
      client_id: id,
    });
  });
  it("Should be able to substituted a document image user front", async () => {
    // arrange
    const [{ id }] = usersFactory.generate({
      quantity: 1,
      id: "true",
      active: true,
    });

    const [tag] = tagsFactory.generate({
      quantity: 3,
      id: "true",
      active: true,
    });

    usersRepositoryMock.findById.mockResolvedValue(undefined);
    // act
    // assert
    expect.assertions(2);
    await expect(
      createTagsUsersClientService.execute({ tags: [tag], client_id: id })
    ).rejects.toEqual(new AppError(NOT_FOUND.USER_DOES_NOT_EXIST));
    expect(usersRepositoryMock.findById).toHaveBeenCalledWith(id);
  });
});
