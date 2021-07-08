import faker from "faker";

import { ImagesFactory } from "@shared/infra/typeorm/factories";

describe("ImagesFactory", () => {
  const imagesFactory = new ImagesFactory();

  it("Should be able to create factory an images with random information", async () => {
    // arrange act
    const images = imagesFactory.generate({
      quantity: 1,
      id: "true",
    });

    // assert
    expect(images).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: expect.any(String) && images[0].id,
          name: expect.any(String) && images[0].name,
        }),
      ])
    );
  });

  it("Should be able to create factory an images with parameters information", async () => {
    // arrange act
    const name = faker.image.avatar();

    const images = imagesFactory.generate({
      quantity: 1,
      id: "true",
      name,
    });

    // assert
    expect(images).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: expect.any(String) && images[0].id,
          name: expect.any(String) && name,
        }),
      ])
    );
  });

  it("Should be able to create factory an images without quantity and id", async () => {
    // arrange act
    const images = imagesFactory.generate({});

    // assert
    expect(images).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: undefined,
          name: expect.any(Boolean) && images[0].name,
        }),
      ])
    );
  });
});
