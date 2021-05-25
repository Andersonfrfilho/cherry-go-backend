import request from "supertest";
import { Connection, createConnections } from "typeorm";

import typeormConfigTest from "@root/ormconfig.test";
import { HttpErrorCodes, HttpSuccessCode } from "@shared/enums/statusCode";
import { app } from "@shared/infra/http/app";
import { UsersFactory } from "@shared/infra/typeorm/factories";

let connection: Connection;
describe("Create users clients controller", () => {
  const usersFactory = new UsersFactory();
  const paths = {
    users_sessions: "/users/sessions",
    users_clients: "/users/clients",
  };
  beforeAll(async () => {
    [connection] = await createConnections(typeormConfigTest);
    await connection.runMigrations();
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });
  it("should be able to create a new user", async () => {
    // arrange
    const [{ name, last_name, cpf, rg, email }] = usersFactory.generate({
      quantity: 1,
      active: true,
    });

    // act
    const response = await request(app)
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

    // assert
    expect(response.status).toBe(HttpSuccessCode.OK);
    expect(response.body).toEqual(
      expect.objectContaining({
        name: expect.any(String),
        last_name: expect.any(String),
        cpf: expect.any(String),
        rg: expect.any(String),
        email: expect.any(String),
        active: expect.any(Boolean),
      })
    );
  });

  it("should not be create user minor", async () => {
    // arrange
    const [{ name, last_name, cpf, rg, email }] = usersFactory.generate({
      quantity: 1,
      active: true,
    });

    // act
    const response = await request(app).post(paths.users_clients).send({
      name,
      last_name,
      cpf,
      rg,
      email,
      password: "102030",
      password_confirm: "102030",
      birth_date: new Date(),
    });

    // assert
    expect(response.status).toBe(HttpErrorCodes.BAD_REQUEST);
    expect(response.body.validation.body.message).toBe(
      "invalid date_birth, you are a minor"
    );
  });

  it("should not be able to create a new user with same email", async () => {
    // arrange
    const [{ name, last_name, cpf, rg, email }] = usersFactory.generate({
      quantity: 1,
      active: true,
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

    const response = await request(app)
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

    // assert
    expect(response.status).toBe(HttpErrorCodes.BAD_REQUEST);
    expect(response.body.message).toBe("User client already exist");
  });
});
