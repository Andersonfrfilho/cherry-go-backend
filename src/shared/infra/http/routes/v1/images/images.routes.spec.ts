import path from "path";
import request from "supertest";
import { Connection, createConnections, getConnection } from "typeorm";

import { orm_test } from "@root/ormconfig.test";
import { app } from "@shared/infra/http/app";
import { HTTP_STATUS_CODE_SUCCESS } from "@shared/infra/http/enums/HttpSuccessCode.enum";
import {
  ImagesFactory,
  PaymentsTypesFactory,
  TransportsTypesFactory,
  UsersFactory,
  UsersTypesFactory,
} from "@shared/infra/typeorm/factories";

let connection: Connection;
describe("Create image route", () => {
  const usersFactory = new UsersFactory();
  const paths = {
    v1: {
      users_sessions: "/v1/users/sessions",
      users_active: "/v1/users/clients/active",
      users_clients: "/v1/users/clients",
      images: "/v1/images",
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

  afterEach(async () => {
    await connection.query(`
      DELETE FROM
        users_terms_accepts;
      DELETE FROM
        users_types_users;
      DELETE FROM
        images;
      DELETE FROM
        users;
  `);
  }, 30000);

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  }, 30000);
  it("should be able to create a new image", async () => {
    // arrange
    console.log("################");
    const [{ name, last_name, cpf, rg, email }] = usersFactory.generate({
      quantity: 1,
    });
    // const [image] = imagesFactory.generate({ quantity: 1 });

    // act
    await request(app)
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
    await request(app).patch(paths.v1.users_active).send({
      cpf,
    });
    const {
      body: { token },
    } = await request(app).post(paths.v1.users_sessions).send({
      email,
      password: "102030",
    });
    console.log(token);
    const path_file = path.resolve(
      __dirname,
      "..",
      "..",
      "..",
      "..",
      "..",
      "..",
      "..",
      "avatar.jpg"
    );
    console.log("###########token");
    const response = await request(app)
      .post(paths.v1.images)
      .set({
        Authorization: `Bearer ${token}`,
      })
      .field("image", "image")
      .attach("avatar", path_file);

    console.log(response.body);
    expect(response.status).toBe(HTTP_STATUS_CODE_SUCCESS.OK);
    expect(response.body).toEqual(
      expect.objectContaining({
        id: expect.any(String),
        name: expect.any(String),
      })
    );
  }, 30000);

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
