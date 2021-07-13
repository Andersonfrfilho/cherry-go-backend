import request from "supertest";
import { Connection, createConnections, getConnection } from "typeorm";

import { orm_test } from "@root/ormconfig.test";
import { app } from "@shared/infra/http/app";
// import { HttpErrorCodes, HttpSuccessCode } from "@shared/enums/statusCode";
import {
  TagsFactory,
  ImagesFactory,
  UsersFactory,
  UsersTypesFactory,
  TransportsTypesFactory,
  PaymentsTypesFactory,
} from "@shared/infra/typeorm/factories";

let connection: Connection;
describe("Create authenticated controller", () => {
  const usersFactory = new UsersFactory();
  const imagesFactory = new ImagesFactory();
  const tagsFactory = new TagsFactory();
  const paths = {
    v1: {
      users_sessions: "/v1/users/sessions",
      users_clients: "/v1/users/clients",
      tags: "/v1/tags",
    },
  };
  beforeAll(async () => {
    [connection] = await createConnections(orm_test);
    await connection.runMigrations();
    const users_types_factory = new UsersTypesFactory();
    const users_types = users_types_factory.generate({
      active: true,
      description: null,
    });
    await connection.getRepository("types_users").save(users_types);

    const users_transports_types_factory = new TransportsTypesFactory();
    const transports_types = users_transports_types_factory.generate({
      active: true,
      description: null,
    });
    await connection.getRepository("transports_types").save(transports_types);

    const payments_types_factory = new PaymentsTypesFactory();
    const payments_types = payments_types_factory.generate({
      active: true,
      description: null,
    });
    await connection.getRepository("payments_types").save(payments_types);
  }, 30000);

  afterAll(async () => {
    // await connection.dropDatabase();
    await connection.close();
  }, 30000);
  it("should be able to create a new token", async () => {
    // arrange
    const [{ name, last_name, cpf, rg, email }] = usersFactory.generate({
      quantity: 1,
    });
    // const [image] = imagesFactory.generate({ quantity: 1 });
    // const [{ name, active, description }] = tagsFactory.generate({
    //   quantity: 1,
    //   active: true,
    // });

    // act
    const data = await request(app)
      .post(paths.v1.users_clients)
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
    console.log(data.body);
    // const response = await request(app).post(paths.users_sessions).send({
    //   email,
    //   password: "102030",
    // });

    // assert
    // expect(response.status).toBe(200);
    // expect(response.body).toEqual(
    //   expect.objectContaining({
    //     refresh_token: expect.any(String),
    //     token: expect.any(String),
    //     user: expect.objectContaining({
    //       name: expect.any(String),
    //       last_name: expect.any(String),
    //       cpf: expect.any(String),
    //       rg: expect.any(String),
    //       email: expect.any(String),
    //       active: expect.any(Boolean),
    //     }),
    //   })
    // );
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
