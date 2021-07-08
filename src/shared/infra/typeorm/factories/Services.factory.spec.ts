import faker from "faker";

import { ServicesFactory } from "@shared/infra/typeorm/factories";

describe("ServicesFactory", () => {
  const servicesFactory = new ServicesFactory();

  it("Should be able to create factory an services  with random information", async () => {
    // arrange
    // act
    const services = servicesFactory.generate({
      quantity: 1,
      id: "true",
    });

    // assert
    expect(services).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: expect.any(String) && services[0].id,
          name: expect.any(String) && services[0].name,
          amount: expect.any(Number) && services[0].amount,
          duration: expect.any(Number) && services[0].duration,
          active: expect.any(Boolean) && services[0].active,
        }),
      ])
    );
  });

  it("Should be able to create factory an phones with parameters information", async () => {
    // arrange
    // act
    const name = faker.name.jobTitle();
    const amount = faker.datatype.number();
    const duration = faker.datatype.number({ min: 10000, max: 99999 });
    const active = faker.datatype.boolean();

    const services = servicesFactory.generate({
      quantity: 1,
      id: "true",
      name,
      amount,
      duration,
      active,
    });

    // assert
    expect(services).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: expect.any(String) && services[0].id,
          name: expect.any(String) && name,
          amount: expect.any(Number) && amount,
          duration: expect.any(Number) && duration,
          active: expect.any(Boolean) && active,
        }),
      ])
    );
  });

  it("Should be able to create factory an payments types content faker without quantity and id", async () => {
    // arrange
    // act
    const services = servicesFactory.generate({});
    // assert
    expect(services).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: undefined,
          name: expect.any(String) && services[0].name,
          amount: expect.any(Number) && services[0].amount,
          duration: expect.any(Number) && services[0].duration,
          active: expect.any(Boolean) && services[0].active,
        }),
      ])
    );
  });
});
