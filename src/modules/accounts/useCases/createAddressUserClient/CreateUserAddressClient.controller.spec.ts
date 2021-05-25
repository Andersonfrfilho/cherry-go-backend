import request from "supertest";
import { Connection, createConnections } from "typeorm";

import typeormConfigTest from "@root/ormconfig.test";
import { HttpErrorCodes, HttpSuccessCode } from "@shared/enums/statusCode";
import { app } from "@shared/infra/http/app";
import {
  AddressesFactory,
  UsersFactory,
} from "@shared/infra/typeorm/factories";

let connection: Connection;
describe("Create address users clients controller", () => {
  const usersFactory = new UsersFactory();
  const addressesFactory = new AddressesFactory();
  const paths = {
    users_sessions: "/users/sessions",
    users_clients: "/users/clients",
    users_clients_addresses: "/users/clients/addresses",
  };
  beforeAll(async () => {
    [connection] = await createConnections(typeormConfigTest);
    await connection.runMigrations();
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });
  it("should be able to create a new addresses for user", async () => {
    // arrange
    const [{ name, last_name, cpf, rg, email }] = usersFactory.generate({
      quantity: 1,
      active: true,
    });
    const [
      { state, city, number, zipcode, country, district, street },
    ] = addressesFactory.generate({
      quantity: 1,
    });

    // act
    await request(app)
      .post(paths.users_clients)
      .send({
        name,
        last_name,
        cpf,
        rg,
        email,
        password: "102030",
        password_confirm: "102030",
        birth_date: new Date(1995, 11, 17),
      });

    const {
      body: { token },
    } = await request(app).post(paths.users_sessions).send({
      email,
      password: "102030",
    });

    const response = await request(app)
      .patch(paths.users_clients_addresses)
      .auth(token, { type: "bearer" })
      .send({ state, city, number, zipcode, country, district, street });

    // assert
    expect(response.status).toBe(HttpSuccessCode.OK);
    expect(response.body).toEqual(
      expect.objectContaining({
        id: expect.any(String),
        name: expect.any(String),
        last_name: expect.any(String),
        cpf: expect.any(String),
        rg: expect.any(String),
        email: expect.any(String),
        active: expect.any(Boolean),
        addresses: expect.arrayContaining([
          expect.objectContaining({
            id: expect.any(String),
            street: expect.any(String),
            number: expect.any(String),
            zipcode: expect.any(String),
            district: expect.any(String),
            city: expect.any(String),
            state: expect.any(String),
            country: expect.any(String),
          }),
        ]),
      })
    );
  });

  it("should not be create user address with token invalid minor", async () => {
    // arrange
    const [
      { city, country, district, number, state, street, zipcode },
    ] = addressesFactory.generate({
      quantity: 1,
    });

    // act

    const response = await request(app)
      .patch(paths.users_clients_addresses)
      .auth("invalid_token", { type: "bearer" })
      .send({ state, city, number, zipcode, country, district, street });

    // assert
    expect(response.status).toBe(HttpErrorCodes.UNAUTHORIZED);
  });
});
