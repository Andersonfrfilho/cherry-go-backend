import request from "supertest";
import { Connection, createConnections } from "typeorm";

import typeormConfigTest from "@root/ormconfig.test";
import { HttpErrorCodes, HttpSuccessCode } from "@shared/enums/statusCode";
import { app } from "@shared/infra/http/app";
import { UsersFactory } from "@shared/infra/typeorm/factories";

let connection: Connection;
describe("Create reset password controller", () => {
  const usersFactory = new UsersFactory();
  const paths = {
    users_sessions: "/v1/users/sessions",
    users_clients: "/v1/users/clients",
    password_reset: "/v1/password/reset",
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
  it("should be able to reset password", async () => {
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
    const response = await request(app)
      .post(paths.password_reset)
      .query({ token: refresh_token })
      .send({
        password: "102030",
      });

    // assert
    expect(response.status).toBe(HttpSuccessCode.NO_CONTENT);
  });

  it("should be able to reset password", async () => {
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
      body: { token },
    } = await request(app).post(paths.users_sessions).send({
      email,
      password: "102030",
    });
    const response = await request(app)
      .post(paths.password_reset)
      .query({ token })
      .send({
        password: "102030",
      });

    // assert
    expect(response.status).toBe(HttpErrorCodes.BAD_REQUEST);
    expect(response.body.message).toBe("Token invalid!");
  });
});
