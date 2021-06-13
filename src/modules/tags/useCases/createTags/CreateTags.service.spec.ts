import "reflect-metadata";

import { usersRepositoryMock } from "@modules/accounts/repositories/mocks/UsersRepository.mock";
import { CreateTagsUsersClientService } from "@modules/accounts/useCases/createTagsUsersClient/CreateTagsUsersClient.service";
import { tagsRepositoryMock } from "@modules/tags/repositories/mocks/TagsRepository.mock";
import { CreateTagsService } from "@modules/tags/useCases/createTags/CreateTags.service";
import { AppError } from "@shared/errors/AppError";
import { BAD_REQUEST, CONFLICT } from "@shared/errors/constants";
import {
  AddressesFactory,
  ImagesFactory,
  PhonesFactory,
  TagsFactory,
  UsersFactory,
  UsersTypesFactory,
  UserTermFactory,
} from "@shared/infra/typeorm/factories";

let createTagsService: CreateTagsService;
const mocked_date = new Date("2020-09-01T09:33:37");
jest.mock("uuid");
jest.useFakeTimers("modern").setSystemTime(mocked_date.getTime());

describe("CreateTagsService", () => {
  const usersFactory = new UsersFactory();
  const usersTypesFactory = new UsersTypesFactory();
  const phonesFactory = new PhonesFactory();
  const addressesFactory = new AddressesFactory();
  const imageProfileFactory = new ImagesFactory();
  const userTermFactory = new UserTermFactory();
  const tagsFactory = new TagsFactory();

  beforeEach(() => {
    createTagsService = new CreateTagsService(tagsRepositoryMock);
  });

  it("Should be able to create a tag user front", async () => {
    // arrange
    const [image_tag] = imageProfileFactory.generate({
      quantity: 1,
      id: "true",
    });
    const [{ active, name, description, id }] = tagsFactory.generate({
      quantity: 3,
      id: "true",
      active: true,
    });

    tagsRepositoryMock.findByName.mockResolvedValue(undefined);
    tagsRepositoryMock.create.mockResolvedValue({
      active,
      name,
      description,
      id,
    });

    // act
    await createTagsService.execute({
      active,
      description,
      name,
      image_id: image_tag.id,
    });

    // assert
    expect(tagsRepositoryMock.findByName).toHaveBeenCalledWith(name);
    expect(tagsRepositoryMock.create).toHaveBeenCalledWith({
      active,
      description,
      name,
      image_id: image_tag.id,
    });
  });
  it("Should be able to substituted a document image user front", async () => {
    // arrange
    const [image_tag] = imageProfileFactory.generate({
      quantity: 1,
      id: "true",
    });
    const [{ active, name, description, id }] = tagsFactory.generate({
      quantity: 3,
      id: "true",
      active: true,
    });

    tagsRepositoryMock.findByName.mockResolvedValue({
      active,
      name,
      description,
      id,
    });

    // act
    // assert
    expect.assertions(2);
    await expect(
      createTagsService.execute({
        active,
        description,
        name,
        image_id: image_tag.id,
      })
    ).rejects.toEqual(new AppError(CONFLICT.TAG_ALREADY_EXIST));
    expect(tagsRepositoryMock.findByName).toHaveBeenCalledWith(name);
  });
});
