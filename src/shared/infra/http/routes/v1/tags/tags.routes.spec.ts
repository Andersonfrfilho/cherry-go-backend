import request from "supertest";
import { Connection, createConnection } from "typeorm";

import { app } from "@shared/infra/http/app";
import createConnections from "@shared/infra/typeorm";
// import { HttpErrorCodes, HttpSuccessCode } from "@shared/enums/statusCode";
import { UsersFactory } from "@shared/infra/typeorm/factories";

let connection: Connection;
describe("Create authenticated controller", () => {
  const usersFactory = new UsersFactory();
  const paths = {
    users_sessions: "/users/sessions",
    users_clients: "/users/clients",
  };
  beforeAll(async () => {
    [connection] = await createConnections();
    await connection.runMigrations();
    //   // const usersFactory = new UsersFactory();
    //   // const [user] = usersFactory.generate({ quantity: 1 });
    //   // await connection.getRepository(User).save(user);
    //   //   const password = await hash("admin", 8);
    //   //   await connection.query(`
    //   //   INSERT INTO USERS(id,name, email, password, "isAdmin", created_at,driver_license)
    //   //   values('${id}','admin','admin@rentx.com.br','${password}',true,'now()','XXXXX')
    //   // `);
  }, 30000);

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  }, 30000);
  it("should be able to create a new token", async () => {
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

    const response = await request(app).post(paths.users_sessions).send({
      email,
      password: "102030",
    });

    // assert
    expect(response.status).toBe(200);
    expect(response.body).toEqual(
      expect.objectContaining({
        refresh_token: expect.any(String),
        token: expect.any(String),
        user: expect.objectContaining({
          name: expect.any(String),
          last_name: expect.any(String),
          cpf: expect.any(String),
          rg: expect.any(String),
          email: expect.any(String),
          active: expect.any(Boolean),
        }),
      })
    );
  }, 30000);

  // it("should not be able authenticated if user not exist", async () => {
  //   const [{ email }] = usersFactory.generate({
  //     quantity: 1,
  //     active: true,
  //   });

  //   const response = await request(app)
  //     .post(paths.users_sessions)
  //     .send({ email, password: "invalid_password" });

  //   expect(response.status).toBe(400);
  // });

  // it("should not be able authenticated if incorrect password", async () => {
  //   // arrange
  //   const [{ name, last_name, cpf, rg, email }] = usersFactory.generate({
  //     quantity: 1,
  //     active: true,
  //   });

  //   // act
  //   await request(app)
  //     .post(paths.users_clients)
  //     .send({
  //       name,
  //       last_name,
  //       cpf,
  //       rg,
  //       email,
  //       password: "102030",
  //       password_confirm: "102030",
  //       birth_date: new Date(1995, 11, 17),
  //     });

  //   const response = await request(app).post(paths.users_sessions).send({
  //     email,
  //     password: "invalid_password",
  //   });

  //   expect(response.status).toBe(403);
  // });
});
