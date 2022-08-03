import { faker } from "@faker-js/faker/locale/pt_BR";
import { TransportsFactory } from "@shared/infra/typeorm/factories";

describe("TransportFactory", () => {
  const transportsFactory = new TransportsFactory();

  it("Should be able to create factory an transports with random information", async () => {
    // arrange act

    const transports = transportsFactory.generate({
      quantity: 1,
      id: "true",
    });

    // assert
    expect(transports).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: expect.any(String) && transports[0].id,
          amount: expect.any(Number) && transports[0].amount,
          confirm: expect.any(Boolean) && transports[0].confirm,
          initial_hour: expect.any(Date) && transports[0].initial_hour,
          departure_time: expect.any(Date) && transports[0].departure_time,
          arrival_time_destination:
            expect.any(Date) && transports[0].arrival_time_destination,
          arrival_time_return:
            expect.any(Date) && transports[0].arrival_time_return,
          return_time: expect.any(Date) && transports[0].return_time,
        }),
      ])
    );
  });

  it("Should be able to create factory an tags with parameters information", async () => {
    // arrange act

    const amount = faker.datatype.number();
    const confirm = faker.datatype.boolean();
    const initial_hour = faker.date.future();
    const departure_time = faker.date.soon();
    const arrival_time_destination = faker.date.future();
    const arrival_time_return = faker.date.future();
    const return_time = faker.date.future();

    const transports = transportsFactory.generate({
      quantity: 1,
      id: "true",
      amount,
      confirm,
      initial_hour,
      departure_time,
      arrival_time_destination,
      arrival_time_return,
      return_time,
    });

    // assert
    expect(transports).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: expect.any(String) && transports[0].id,
          amount: expect.any(Number) && amount,
          confirm: expect.any(Boolean) && confirm,
          initial_hour: expect.any(Date) && initial_hour,
          departure_time: expect.any(Date) && departure_time,
          arrival_time_destination:
            expect.any(Date) && arrival_time_destination,
          arrival_time_return: expect.any(Date) && arrival_time_return,
          return_time: expect.any(Date) && return_time,
        }),
      ])
    );
  });

  it("Should be able to create factory an tags content faker without quantity and id", async () => {
    // arrange act
    const transports = transportsFactory.generate({});

    // assert
    expect(transports).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: undefined,
          amount: expect.any(Number) && transports[0].amount,
          confirm: expect.any(Boolean) && transports[0].confirm,
          initial_hour: expect.any(Date) && transports[0].initial_hour,
          departure_time: expect.any(Date) && transports[0].departure_time,
          arrival_time_destination:
            expect.any(Date) && transports[0].arrival_time_destination,
          arrival_time_return:
            expect.any(Date) && transports[0].arrival_time_return,
          return_time: expect.any(Date) && transports[0].return_time,
        }),
      ])
    );
  });
});
