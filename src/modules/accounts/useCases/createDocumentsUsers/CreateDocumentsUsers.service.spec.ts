import "reflect-metadata";
import faker from "faker";

import { UserDocumentValue } from "@modules/accounts/enums/UserDocumentValue.enum";
import { usersDocumentsRepositoryMock } from "@modules/accounts/repositories/mocks/UsersDocumentsRepository.mock";
import { usersRepositoryMock } from "@modules/accounts/repositories/mocks/UsersRepository.mock";
import { CreateDocumentsUsersService } from "@modules/accounts/useCases/createDocumentsUsers/CreateDocumentsUsers.service";
import { imagesRepositoryMock } from "@modules/images/repositories/mocks/ImagesRepository.mock";
import { StorageTypeFolderEnum } from "@shared/container/providers/StorageProvider/enums/StorageTypeFolder.enum";
import { storageProviderMock } from "@shared/container/providers/StorageProvider/mock/StorageProvider.mock";
import {
  AddressesFactory,
  ImagesFactory,
  PhonesFactory,
  UsersFactory,
  UsersTypesFactory,
  UserTermFactory,
} from "@shared/infra/typeorm/factories";

let createDocumentsUsersService: CreateDocumentsUsersService;
const mocked_date = new Date("2020-09-01T09:33:37");
jest.mock("uuid");
jest.useFakeTimers("modern").setSystemTime(mocked_date.getTime());

describe("CreateDocumentsUsersService", () => {
  const usersFactory = new UsersFactory();
  const usersTypesFactory = new UsersTypesFactory();
  const phonesFactory = new PhonesFactory();
  const addressesFactory = new AddressesFactory();
  const imageProfileFactory = new ImagesFactory();
  const userTermFactory = new UserTermFactory();

  beforeEach(() => {
    createDocumentsUsersService = new CreateDocumentsUsersService(
      usersRepositoryMock,
      usersDocumentsRepositoryMock,
      storageProviderMock,
      imagesRepositoryMock
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
    const [image_document_front] = imageProfileFactory.generate({
      quantity: 1,
      id: "true",
    });
    usersRepositoryMock.findByIdWithDocument.mockResolvedValue({
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
      documents: [],
    });
    storageProviderMock.save.mockResolvedValue(name_file);
    imagesRepositoryMock.create.mockResolvedValue(image_document_front);
    usersDocumentsRepositoryMock.create.mockResolvedValue({});

    // act
    await createDocumentsUsersService.execute({
      user_id: id,
      document_file: name_file,
      description: UserDocumentValue.FRONT,
    });

    // assert
    expect(usersRepositoryMock.findByIdWithDocument).toHaveBeenCalledWith(id);
    expect(storageProviderMock.save).toHaveBeenCalledWith(
      name_file,
      StorageTypeFolderEnum.DOCUMENTS
    );
    expect(imagesRepositoryMock.create).toHaveBeenCalledWith({
      name: name_file,
    });
    expect(usersDocumentsRepositoryMock.create).toHaveBeenCalledWith({
      image_id: image_document_front.id,
      user_id: id,
      value: rg,
      description: UserDocumentValue[UserDocumentValue.FRONT],
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
    const document_user_id = faker.datatype.uuid();
    usersRepositoryMock.findByIdWithDocument.mockResolvedValue({
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
      documents: [
        {
          id: document_user_id,
          image_id: image_document_front.id,
          image: image_document_front,
        },
      ],
    });
    imagesRepositoryMock.findById.mockResolvedValue(image_document_front);
    usersDocumentsRepositoryMock.deleteById.mockResolvedValue({});
    storageProviderMock.delete.mockResolvedValue({});
    imagesRepositoryMock.deleteById.mockResolvedValue({});
    storageProviderMock.save.mockResolvedValue(name_file);
    imagesRepositoryMock.create.mockResolvedValue(image_document_front);
    usersDocumentsRepositoryMock.create.mockResolvedValue({});

    // act
    await createDocumentsUsersService.execute({
      user_id: id,
      document_file: name_file,
      description: UserDocumentValue.FRONT.toUpperCase(),
    });

    // assert
    expect(usersRepositoryMock.findByIdWithDocument).toHaveBeenCalledWith(id);
    expect(imagesRepositoryMock.findById).toHaveBeenCalledWith(
      image_document_front.id
    );
    expect(usersDocumentsRepositoryMock.deleteById).toHaveBeenCalledWith(
      document_user_id
    );
    expect(storageProviderMock.delete).toHaveBeenCalledWith(
      image_document_front.name,
      StorageTypeFolderEnum.DOCUMENTS
    );
    expect(imagesRepositoryMock.deleteById).toHaveBeenCalledWith(
      image_document_front.id
    );
    expect(storageProviderMock.save).toHaveBeenCalledWith(
      name_file,
      StorageTypeFolderEnum.DOCUMENTS
    );
    expect(imagesRepositoryMock.create).toHaveBeenCalledWith({
      name: name_file,
    });
    expect(usersDocumentsRepositoryMock.create).toHaveBeenCalledWith({
      image_id: image_document_front.id,
      user_id: id,
      value: rg,
      description: UserDocumentValue[UserDocumentValue.FRONT.toUpperCase()],
    });
  });
});
