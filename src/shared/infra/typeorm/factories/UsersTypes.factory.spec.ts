import faker from "faker";

import { TRANSPORT_TYPES_ENUM } from "@modules/transports/enums/TransportsTypes.enum";
import { UsersTypesFactory } from "@shared/infra/typeorm/factories";

describe("UsersTypesFactory", () => {
  const usersTypesFactory = new UsersTypesFactory();

  it("Should be able to create factory an users types with random information", async () => {
    // arrange act
    const usersTypes = usersTypesFactory.generate({
      id: "true",
    });

    // assert
    expect(usersTypes).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: expect.any(String) && usersTypes[0].id,
          name: expect.any(String) && usersTypes[0].name,
          last_name: expect.any(String) && usersTypes[0].description,
          email: expect.any(Boolean) && usersTypes[0].active,
        }),
      ])
    );
  });

  it("Should be able to create factory an users types types with parameters information", async () => {
    // arrange act

    const active = faker.datatype.boolean();
    const description = faker.random.words();

    const usersTypes = usersTypesFactory.generate({
      id: "true",
    });

    // assert
    expect(usersTypes).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: expect.any(String) && usersTypes[0].id,
          name: expect.any(TRANSPORT_TYPES_ENUM) && usersTypes[0].name,
          active: expect.any(Boolean) && active,
          description: expect.any(Boolean) && description,
        }),
      ])
    );
  });

  it("Should be able to create factory an users types content faker without quantity and id", async () => {
    // arrange act
    const usersTypes = usersTypesFactory.generate({});

    // assert
    expect(usersTypes).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: undefined,
          name: expect.any(TRANSPORT_TYPES_ENUM) && usersTypes[0].name,
          active: expect.any(Boolean) && usersTypes[0].active,
          description: expect.any(Boolean) && usersTypes[0].description,
        }),
      ])
    );
  });
});
