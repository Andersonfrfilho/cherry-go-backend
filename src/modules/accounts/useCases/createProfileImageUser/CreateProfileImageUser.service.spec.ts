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
  UsersFactory,
  UsersTypesFactory,
  UserTermFactory,
} from "@shared/infra/typeorm/factories";

let createProfileImageUserService: CreateProfileImageUserService;
const mocked_date = new Date("2020-09-01T09:33:37");
jest.mock("uuid");
jest.useFakeTimers("modern").setSystemTime(mocked_date.getTime());

describe("CreateProfileImageUserService", () => {
  const usersFactory = new UsersFactory();
  const usersTypesFactory = new UsersTypesFactory();
  const phonesFactory = new PhonesFactory();
  const addressesFactory = new AddressesFactory();
  const imageProfileFactory = new ImagesFactory();
  const userTermFactory = new UserTermFactory();

  beforeEach(() => {
    createProfileImageUserService = new CreateProfileImageUserService(
      usersRepositoryMock,
      storageProviderMock,
      imagesRepositoryMock,
      userProfileImageRepositoryMock
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
    const name_file = faker.name.firstName();

    usersRepositoryMock.findByIdWithProfileImage.mockResolvedValue({
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
      image_profile: [],
      term: [term],
      documents: [],
    });
    storageProviderMock.save.mockResolvedValue(name_file);
    imagesRepositoryMock.create.mockResolvedValue(image_profile);
    userProfileImageRepositoryMock.create.mockResolvedValue({});

    // act
    await createProfileImageUserService.execute({
      user_id: id,
      image_profile_name: name_file,
    });

    // assert
    expect(usersRepositoryMock.findByIdWithProfileImage).toHaveBeenCalledWith(
      id
    );
    expect(storageProviderMock.save).toHaveBeenCalledWith(
      name_file,
      StorageTypeFolderEnum.PROFILES
    );
    expect(imagesRepositoryMock.create).toHaveBeenCalledWith({
      name: name_file,
    });
    expect(userProfileImageRepositoryMock.create).toHaveBeenCalledWith({
      image_id: image_profile.id,
      user_id: id,
    });
  });
  it("Should be able to substituted a document image user front", async () => {
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
    const name_file = faker.name.firstName();
    const [image_document_front] = imageProfileFactory.generate({
      quantity: 1,
      id: "true",
    });
    const [new_image_profile] = imageProfileFactory.generate({
      quantity: 1,
      id: "true",
    });
    const image_profile_id = faker.datatype.uuid();
    usersRepositoryMock.findByIdWithProfileImage.mockResolvedValue({
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
      image_profile: [
        {
          id: image_profile_id,
          image_id: image_profile.id,
          image: image_profile,
        },
      ],
      term: [term],
      documents: [
        {
          image_id: image_document_front.id,
          image: image_document_front,
        },
      ],
    });
    imagesRepositoryMock.findById.mockResolvedValue(new_image_profile);
    userProfileImageRepositoryMock.deleteById.mockResolvedValue({});
    storageProviderMock.delete.mockResolvedValue({});
    imagesRepositoryMock.deleteById.mockResolvedValue({});
    storageProviderMock.save.mockResolvedValue(new_image_profile.name);
    imagesRepositoryMock.create.mockResolvedValue(new_image_profile);
    userProfileImageRepositoryMock.create.mockResolvedValue({});

    // act
    await createProfileImageUserService.execute({
      user_id: id,
      image_profile_name: new_image_profile.name,
    });

    // assert
    expect(usersRepositoryMock.findByIdWithProfileImage).toHaveBeenCalledWith(
      id
    );
    expect(userProfileImageRepositoryMock.deleteById).toHaveBeenCalledWith(
      image_profile_id
    );
    expect(storageProviderMock.delete).toHaveBeenCalledWith(
      image_profile.name,
      StorageTypeFolderEnum.PROFILES
    );
    expect(imagesRepositoryMock.deleteById).toHaveBeenCalledWith(
      image_profile.id
    );
    expect(storageProviderMock.save).toHaveBeenCalledWith(
      new_image_profile.name,
      StorageTypeFolderEnum.PROFILES
    );
    expect(imagesRepositoryMock.create).toHaveBeenCalledWith({
      name: new_image_profile.name,
    });
    expect(userProfileImageRepositoryMock.create).toHaveBeenCalledWith({
      image_id: new_image_profile.id,
      user_id: id,
    });
  });
});
