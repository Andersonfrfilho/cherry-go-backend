import "reflect-metadata";

import { imagesRepositoryMock } from "@modules/images/repositories/mocks/Images.repository.mock";
import { CreateImageService } from "@modules/images/useCases/createImage/CreateImage.service";
import { storageProviderMock } from "@shared/container/providers/StorageProvider/mock/Storage.provider.mock";
import { ImagesFactory } from "@shared/infra/typeorm/factories";

let createImageService: CreateImageService;

describe("CreateImageService", () => {
  const imagesFactory = new ImagesFactory();

  beforeEach(() => {
    createImageService = new CreateImageService(
      storageProviderMock,
      imagesRepositoryMock
    );
  });

  it("Should be able to active an user", async () => {
    // arrange
    const [image_factory] = imagesFactory.generate({
      quantity: 1,
      id: "true",
    });

    storageProviderMock.save.mockResolvedValue({ name: image_factory.name });
    imagesRepositoryMock.create.mockResolvedValue(image_factory);

    // act
    const result = await createImageService.execute({
      name: image_factory.name,
    });

    // assert
    expect(storageProviderMock.save).toHaveBeenCalledWith({
      name: image_factory.name,
    });
    expect(imagesRepositoryMock.create).toHaveBeenCalledWith({
      name: image_factory.name,
    });
    expect(result).toEqual(
      expect.objectContaining({
        id: expect.any(String) && image_factory.id,
        name: expect.any(String) && image_factory.name,
      })
    );
  });
});
