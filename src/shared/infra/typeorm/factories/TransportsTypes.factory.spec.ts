import faker from "faker";

import { TRANSPORT_TYPES_ENUM } from "@modules/transports/enums/TransportsTypes.enum";
import { TransportsTypesFactory } from "@shared/infra/typeorm/factories";

describe("TransportsTypesFactory", () => {
  const transportsTypesFactory = new TransportsTypesFactory();

  it("Should be able to create factory an transports types with random information", async () => {
    // arrange
    // act
    const transportsTypes = transportsTypesFactory.generate({
      id: "true",
    });

    // assert
    expect(transportsTypes).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: expect.any(String) && transportsTypes[0].id,
          name: expect.any(TRANSPORT_TYPES_ENUM) && transportsTypes[0].name,
          active: expect.any(Boolean) && transportsTypes[0].active,
          description: undefined,
        }),
      ])
    );
  });

  it("Should be able to create factory an transports types with parameters information", async () => {
    // arrange
    // act
    const active = faker.datatype.boolean();
    const description = faker.random.words();

    const transportsTypes = transportsTypesFactory.generate({
      id: "true",
      active,
      description,
    });

    // assert
    expect(transportsTypes).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: expect.any(String) && transportsTypes[0].id,
          name: expect.any(TRANSPORT_TYPES_ENUM) && transportsTypes[0].name,
          active: expect.any(Boolean) && active,
          description: expect.any(Boolean) && description,
        }),
      ])
    );
  });

  it("Should be able to create factory an transports types with parameters information description faker", async () => {
    // arrange
    // act
    const active = faker.datatype.boolean();

    const transportsTypes = transportsTypesFactory.generate({
      id: "true",
      active,
      description: "faker",
    });

    // assert
    expect(transportsTypes).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: expect.any(String) && transportsTypes[0].id,
          name: expect.any(TRANSPORT_TYPES_ENUM) && transportsTypes[0].name,
          active: expect.any(Boolean) && active,
          description: expect.any(Boolean) && transportsTypes[0].description,
        }),
      ])
    );
  });

  it("Should be able to create factory an transports types content faker without quantity and id", async () => {
    // arrange
    // act
    const transportsTypes = transportsTypesFactory.generate({});

    // assert
    expect(transportsTypes).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: undefined,
          name: expect.any(TRANSPORT_TYPES_ENUM) && transportsTypes[0].name,
          active: expect.any(Boolean) && transportsTypes[0].active,
          description: expect.any(Boolean) && transportsTypes[0].description,
        }),
      ])
    );
  });
});
