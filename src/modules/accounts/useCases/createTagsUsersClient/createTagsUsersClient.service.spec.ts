import "reflect-metadata";
import faker from "faker";

import { UserDocumentValue } from "@modules/accounts/enums/UserDocumentValue.enum";
import { UserProfileImageRepository } from "@modules/accounts/infra/typeorm/repositories/UserProfileImageRepository";
import { userProfileImageRepositoryMock } from "@modules/accounts/repositories/mocks/UserProfileImageRepository.mock";
import { usersDocumentsRepositoryMock } from "@modules/accounts/repositories/mocks/UsersDocumentsRepository.mock";
import { usersRepositoryMock } from "@modules/accounts/repositories/mocks/UsersRepository.mock";
import { CreateDocumentsUsersService } from "@modules/accounts/useCases/createDocumentsUsers/CreateDocumentsUsers.service";
import { CreateProfileImageUserService } from "@modules/accounts/useCases/createProfileImageUser/CreateProfileImageUser.service";
import { imagesRepositoryMock } from "@modules/images/repositories/mocks/ImagesRepository.mock";
import { StorageTypeFolderEnum } from "@shared/container/providers/StorageProvider/enums/StorageTypeFolder.enum";
import { storageProviderMock } from "@shared/container/providers/StorageProvider/mock/StorageProvider.mock";
import { AppError } from "@shared/errors/AppError";
import { BAD_REQUEST } from "@shared/errors/constants";
import {
  AddressesFactory,
  ImagesFactory,
  PhonesFactory,
  TagsFactory,
  UsersFactory,
  UsersTypesFactory,
  UserTermFactory,
} from "@shared/infra/typeorm/factories";

import { CreateTagsUsersClientService } from "./CreateTagsUsersClient.service";

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
  const userTermFactory = new UserTermFactory();
  const tagsFactory = new TagsFactory();

  beforeEach(() => {
    createTagsUsersClientService = new CreateTagsUsersClientService(
      usersRepositoryMock
    );
  });

  it("Should be able to create a document image user front", async () => {
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
    const [type] = usersTypesFactory.generate("uuid");
    const [phone] = phonesFactory.generate({ quantity: 1, id: "true" });
    const [address] = addressesFactory.generate({ quantity: 1, id: "true" });
    const [image_profile] = imageProfileFactory.generate({
      quantity: 1,
      id: "true",
    });
    const [term] = userTermFactory.generate({ quantity: 1, accept: true });
    const tags = tagsFactory.generate({
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
    usersRepositoryMock.createTagsUsers.mockResolvedValue({});

    // act
    await createTagsUsersClientService.execute({
      user_id: id,
      tags,
    });

    // assert
    expect(usersRepositoryMock.findById).toHaveBeenCalledWith(id);
    expect(usersRepositoryMock.createTagsUsers).toHaveBeenCalledWith({
      tags,
      user_id: id,
    });
  });
  it("Should be able to substituted a document image user front", async () => {
    // arrange
    const [{ id }] = usersFactory.generate({
      quantity: 1,
      id: "true",
      active: true,
    });

    const tags = tagsFactory.generate({
      quantity: 3,
      id: "true",
      active: true,
    });

    usersRepositoryMock.findById.mockResolvedValue(undefined);

    // act
    // assert
    expect.assertions(2);
    await expect(
      createTagsUsersClientService.execute({
        user_id: id,
        tags,
      })
    ).rejects.toEqual(new AppError(BAD_REQUEST.USER_NOT_EXIST));
    expect(usersRepositoryMock.findById).toHaveBeenCalledWith(id);
  });
});
