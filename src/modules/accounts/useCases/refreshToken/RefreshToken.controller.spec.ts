import request from "supertest";
import {
  Connection,
  createConnection,
  createConnections,
  getRepository,
} from "typeorm";

import { UsersTokensRepository } from "@modules/tags/infra/typeorm/repositories/UsersTokensRepository";
import { HttpErrorCodes, HttpSuccessCode } from "@shared/enums/statusCode";
import { app } from "@shared/infra/http/app";
import { typeormConfigTest } from "@shared/infra/typeorm/config/test";
import { UsersFactory } from "@shared/infra/typeorm/factories";

let connection: Connection;
describe("Create refresh token for authenticated user controller", () => {
  const usersFactory = new UsersFactory();
  const paths = {
    users_sessions: "/users/sessions",
    users_clients: "/users/clients",
    refresh_token: "/refresh_token",
  };
  beforeAll(async () => {
    [connection] = await createConnections(typeormConfigTest);
    await connection.runMigrations();
    //   // const usersFactory = new UsersFactory();
    //   // const [user] = usersFactory.generate({ quantity: 1 });
    //   // await connection.getRepository(User).save(user);
    //   //   const password = await hash("admin", 8);
    //   //   await connection.query(`
    //   //   INSERT INTO USERS(id,name, email, password, "isAdmin", created_at,driver_license)
    //   //   values('${id}','admin','admin@rentx.com.br','${password}',true,'now()','XXXXX')
    //   // `);
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });
  it("should be able create refresh_token", async () => {
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

    const {
      body: { refresh_token },
    } = await request(app).post(paths.users_sessions).send({
      email,
      password: "102030",
    });

    // act
    const response_authenticated = await request(app)
      .post(paths.refresh_token)
      .send({
        token: refresh_token,
      });

    // assert
    expect(response_authenticated.status).toBe(HttpSuccessCode.OK);
    expect(response_authenticated.body).toEqual(
      expect.objectContaining({
        refresh_token: expect.any(String),
        token: expect.any(String),
      })
    );
  });

  // it("should not be able create token inexistent token", async () => {
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

  //   const {
  //     body: { refresh_token },
  //   } = await request(app).post(paths.users_sessions).send({
  //     email,
  //     password: "102030",
  //   });
  //   console.log(refresh_token);
  //   const user_token = await connection
  //     .getRepository("users_tokens")
  //     .find({ where: { refresh_token } });
  //   console.log(user_token);
  //   await connection.getRepository("users_tokens").delete(user_token);
  //   // act
  //   await request(app).post(paths.refresh_token).send({
  //     token: refresh_token,
  //   });

  //   const response = await request(app).post(paths.refresh_token).send({
  //     token: refresh_token,
  //   });

  //   // assert
  //   expect(response.status).toBe(HttpErrorCodes.BAD_REQUEST);
  //   expect(response.body.message).toBe("Refresh Token does not exists!");
  // });
});
