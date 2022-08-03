import { faker } from "@faker-js/faker/locale/pt_BR"

import { TagsFactory } from "@shared/infra/typeorm/factories";

describe("TagsFactory", () => {
  const tagsFactory = new TagsFactory();

  it("Should be able to create factory an tags with random information", async () => {
    // arrange act

    const tags = tagsFactory.generate({
      quantity: 1,
      id: "true",
    });

    // assert
    expect(tags).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: expect.any(String) && tags[0].id,
          name: expect.any(String) && tags[0].name,
          description: expect.any(String) && tags[0].description,
          active: expect.any(Boolean) && tags[0].active,
        }),
      ])
    );
  });

  it("Should be able to create factory an tags with parameters information", async () => {
    // arrange act

    const name = faker.name.jobTitle();
    const description = faker.lorem.words();
    const active = faker.datatype.boolean();

    const tags = tagsFactory.generate({
      quantity: 1,
      id: "true",
      name,
      description,
      active,
    });

    // assert
    expect(tags).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: expect.any(String) && tags[0].id,
          name: expect.any(String) && name,
          description: expect.any(String) && description,
          active: expect.any(Boolean) && active,
        }),
      ])
    );
  });

  it("Should be able to create factory an tags with parameters faker params", async () => {
    // arrange act

    const name = faker.name.jobTitle();
    const active = faker.datatype.boolean();

    const tags = tagsFactory.generate({
      quantity: 1,
      id: "true",
      name,
      description: "faker",
      active,
    });

    // assert
    expect(tags).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: expect.any(String) && tags[0].id,
          name: expect.any(String) && name,
          description: expect.any(String) && tags[0].description,
          active: expect.any(Boolean) && active,
        }),
      ])
    );
  });

  it("Should be able to create factory an tags content faker without quantity and id", async () => {
    // arrange act
    const tags = tagsFactory.generate({});

    // assert
    expect(tags).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: undefined,
          name: expect.any(String) && tags[0].name,
          description: expect.any(String) && tags[0].description,
          active: expect.any(Boolean) && tags[0].active,
        }),
      ])
    );
  });
});
