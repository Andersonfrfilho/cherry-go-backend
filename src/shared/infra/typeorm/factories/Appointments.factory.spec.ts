import { faker } from "@faker-js/faker/locale/pt_BR";
import { AppointmentsFactory } from "@shared/infra/typeorm/factories";

describe("AppointmentsFactory", () => {
  const appointmentsFactory = new AppointmentsFactory();

  it("Should be able to create factory an appointments with random information", async () => {
    // arrange act
    const appointments = appointmentsFactory.generate({
      quantity: 1,
      id: "true",
    });

    // assert
    expect(appointments).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: expect.any(String) && appointments[0].id,
          confirm: expect.any(Boolean) && appointments[0].confirm,
          initial_date: expect.any(Date) && appointments[0].initial_date,
          final_date: expect.any(Date) && appointments[0].final_date,
        }),
      ])
    );
  });

  it("Should be able to create factory an appointments with parameters information", async () => {
    // arrange act
    const confirm = faker.datatype.boolean();
    const initial_date = faker.date.future();
    const final_date = faker.date.future();

    const appointments = appointmentsFactory.generate({
      quantity: 1,
      id: "true",
      confirm,
      initial_date,
      final_date,
    });

    // assert
    expect(appointments).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: expect.any(String) && appointments[0].id,
          confirm: expect.any(Boolean) && confirm,
          initial_date: expect.any(Date) && initial_date,
          final_date: expect.any(Date) && final_date,
        }),
      ])
    );
  });

  it("Should be able to create factory an appointments without quantity and id", async () => {
    // arrange act
    const appointments = appointmentsFactory.generate({});

    // assert
    expect(appointments).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: undefined,
          confirm: expect.any(Boolean) && appointments[0].confirm,
          initial_date: expect.any(Date) && appointments[0].initial_date,
          final_date: expect.any(Date) && appointments[0].final_date,
        }),
      ])
    );
  });
});
