import faker from "faker";

import { PAYMENT_TYPES_ENUM } from "@modules/transactions/enums";
import { PaymentsTypesFactory } from "@shared/infra/typeorm/factories";

describe("PaymentTypeFactory", () => {
  const paymentsTypesFactory = new PaymentsTypesFactory();

  it("Should be able to create factory an PaymentsTypes  with random information", async () => {
    // arrange act
    const paymentsTypes = paymentsTypesFactory.generate({});

    // assert
    expect(paymentsTypes).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          name: expect.any(String) && paymentsTypes[0].name,
          active: expect.any(Boolean) && paymentsTypes[0].active,
          description: undefined,
        }),
      ])
    );
  });

  it("Should be able to create factory an PaymentsTypes with parameters information", async () => {
    // arrange act
    const active = faker.datatype.boolean();
    const description = faker.lorem.words();
    const paymentsTypes = paymentsTypesFactory.generate({
      active,
      description,
    });

    // assert
    expect(paymentsTypes).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          name: expect.any(PAYMENT_TYPES_ENUM) && paymentsTypes[0].name,
          active: expect.any(Boolean) && active,
          description: expect.any(String) && description,
        }),
      ])
    );
  });

  it("Should be able to create factory an payments types content faker without quantity and id", async () => {
    // arrange act
    const description = "faker";
    const paymentsTypes = paymentsTypesFactory.generate({
      description,
    });

    // assert
    expect(paymentsTypes).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          name: expect.any(PAYMENT_TYPES_ENUM) && paymentsTypes[0].name,
          description: expect.any(String) && paymentsTypes[0].description,
          active: expect.any(Boolean) && paymentsTypes[0].active,
        }),
      ])
    );
  });
});
