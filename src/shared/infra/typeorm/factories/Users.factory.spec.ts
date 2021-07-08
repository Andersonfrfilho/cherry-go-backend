import faker from "faker";

import { UsersFactory } from "@shared/infra/typeorm/factories";

describe("UsersTypesFactory", () => {
  const usersFactory = new UsersFactory();

  it("Should be able to create factory an users types with random information", async () => {
    // arrange act
    const users = usersFactory.generate({
      id: "true",
    });

    // assert
    expect(users).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: expect.any(String) && users[0].id,
          name: expect.any(String) && users[0].name,
          last_name: expect.any(String) && users[0].last_name,
          email: expect.any(String) && users[0].email,
          birth_date: expect.any(Date) && users[0].birth_date,
          cpf: expect.any(String) && users[0].cpf,
          rg: expect.any(String) && users[0].email,
          password_hash: expect.any(String) && users[0].password_hash,
          active: expect.any(Boolean) && users[0].active,
        }),
      ])
    );
  });

  it("Should be able to create factory an users with parameters information", async () => {
    // arrange act
    const name = faker.name.firstName().toLowerCase();
    const last_name = faker.name.lastName().toLowerCase();
    const email = faker.internet.email().toLowerCase();
    const birth_date = faker.date.past();
    const cpf = faker.phone.phoneNumber("###########");
    const rg = faker.phone.phoneNumber(
      faker.datatype.boolean() ? "########" : "#########"
    );
    const password_hash = faker.internet.password();
    const active = faker.datatype.boolean();

    const users = usersFactory.generate({
      id: "true",
      name,
      last_name,
      email,
      birth_date,
      cpf,
      rg,
      password_hash,
      active,
    });

    // assert
    expect(users).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: expect.any(String) && users[0].id,
          name: expect.any(String) && name,
          last_name: expect.any(String) && last_name,
          email: expect.any(String) && email,
          birth_date: expect.any(Date) && birth_date,
          cpf: expect.any(String) && cpf,
          rg: expect.any(String) && email,
          password_hash: expect.any(String) && password_hash,
          active: expect.any(Boolean) && active,
        }),
      ])
    );
  });

  it("Should be able to create factory an users content faker without quantity and id", async () => {
    // arrange  act
    const users = usersFactory.generate({});

    // assert
    expect(users).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: undefined,
          name: expect.any(String) && users[0].name,
          last_name: expect.any(String) && users[0].last_name,
          email: expect.any(String) && users[0].email,
          birth_date: expect.any(Date) && users[0].birth_date,
          cpf: expect.any(String) && users[0].cpf,
          rg: expect.any(String) && users[0].email,
          password_hash: expect.any(String) && users[0].password_hash,
          active: expect.any(Boolean) && users[0].active,
        }),
      ])
    );
  });
});
