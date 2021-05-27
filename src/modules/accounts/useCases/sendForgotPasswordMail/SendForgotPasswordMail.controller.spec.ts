import request from "supertest";
import { Connection, createConnections } from "typeorm";

import typeormConfigTest from "@root/ormconfig.test";
import { HttpErrorCodes, HttpSuccessCode } from "@shared/enums/statusCode";
import { app } from "@shared/infra/http/app";
import { UsersFactory } from "@shared/infra/typeorm/factories";

let connection: Connection;
describe("Create send password reset controller", () => {
  const usersFactory = new UsersFactory();
  const paths = {
    users_sessions: "/v1/users/sessions",
    users_clients: "/v1/users/clients",
    send_forgot_password: "/v1/password/forgot",
  };
  beforeAll(async () => {
    [connection] = await createConnections(typeormConfigTest);
    await connection.runMigrations();
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });
  it("should be able to send token for new password", async () => {
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

    const response = await request(app).post(paths.send_forgot_password).send({
      email,
    });

    // assert
    expect(response.status).toBe(HttpSuccessCode.NO_CONTENT);
  });

  it("should not be able to send email for forgot password if send nobody schema", async () => {
    const response = await request(app).post(paths.send_forgot_password).send();

    expect(response.status).toBe(HttpErrorCodes.BAD_REQUEST);
    expect(response.body.message).toBe("celebrate request validation failed");
  });

  it("should not be able to send token for new password", async () => {
    const [{ email }] = usersFactory.generate({
      quantity: 1,
      active: true,
    });

    const response = await request(app).post(paths.send_forgot_password).send({
      email,
    });

    expect(response.status).toBe(HttpErrorCodes.BAD_REQUEST);
    expect(response.body.message).toBe("User does not exists!");
  });
});
