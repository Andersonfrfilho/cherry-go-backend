import faker from "faker";

import { PhonesFactory } from "@shared/infra/typeorm/factories";

describe("PhonesFactory", () => {
  const phonesFactory = new PhonesFactory();

  it("Should be able to create factory an PaymentsTypes  with random information", async () => {
    // arrange
    // act
    const phones = phonesFactory.generate({
      quantity: 1,
      id: "true",
    });

    // assert
    expect(phones).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: expect.any(String) && phones[0].id,
          country_code: expect.any(String) && phones[0].country_code,
          ddd: expect.any(String) && phones[0].ddd,
          number: expect.any(String) && phones[0].number,
        }),
      ])
    );
  });

  it("Should be able to create factory an phones with parameters information", async () => {
    // arrange
    // act
    const country_code = faker.phone.phoneNumber("+##");
    const ddd = faker.phone.phoneNumber("##");
    const number = faker.phone.phoneNumber("9########");

    const phones = phonesFactory.generate({
      quantity: 1,
      id: "true",
      country_code,
      ddd,
      number,
    });

    // assert
    expect(phones).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: expect.any(String) && phones[0].id,
          country_code: expect.any(String) && country_code,
          ddd: expect.any(String) && ddd,
          number: expect.any(String) && number,
        }),
      ])
    );
  });

  it("Should be able to create factory an payments types content faker without quantity and id", async () => {
    // arrange
    // act
    const phones = phonesFactory.generate({});
    // assert
    expect(phones).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: undefined,
          country_code: expect.any(String) && phones[0].country_code,
          ddd: expect.any(String) && phones[0].ddd,
          number: expect.any(String) && phones[0].number,
        }),
      ])
    );
  });
});
