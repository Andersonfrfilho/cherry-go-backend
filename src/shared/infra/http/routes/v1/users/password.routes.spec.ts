import request from "supertest";
import { Connection, createConnections } from "typeorm";

import { UserTokens } from "@modules/accounts/infra/typeorm/entities/UserTokens";
import { orm_test } from "@root/ormconfig.test";
import { FORBIDDEN, NOT_FOUND } from "@shared/errors/constants";
import { HTTP_ERROR_CODES_ENUM } from "@shared/errors/enums";
import { app } from "@shared/infra/http/app";
import { HTTP_STATUS_CODE_SUCCESS_ENUM } from "@shared/infra/http/enums/HttpSuccessCode.enum";
import { UsersFactory } from "@shared/infra/typeorm/factories";

let connection: Connection;
let seed: Connection;

describe("Password routes", () => {
  const usersFactory = new UsersFactory();

  const paths = {
    v1: {
      users_clients: "/v1/users/clients",
      users_sessions: "/v1/users/sessions",
      users_clients_active: "/v1/users/clients/active",
      users_password_forgot: "/v1/users/password/forgot",
      users_password_reset: "/v1/users/password/reset",
    },
  };
  beforeAll(async () => {
    [connection, seed] = await createConnections(orm_test);
    await connection.runMigrations();
    await seed.runMigrations();
  }, 30000);

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  }, 30000);
  describe("POST", () => {
    describe("Forgot password - /forgot", () => {
      it("should be able forgot password", async () => {
        // arrange
        const [
          { name, last_name, cpf, rg, email, gender },
        ] = usersFactory.generate({
          quantity: 1,
        });

        // act
        const { body: user } = await request(app)
          .post(paths.v1.users_clients)
          .send({
            name,
            last_name,
            cpf,
            rg,
            email,
            password: "102030",
            password_confirm: "102030",
            gender,
            birth_date: new Date(1995, 11, 17),
          });
        const {
          body: { token: token_admin },
        } = await request(app).post(paths.v1.users_sessions).send({
          email: "admin@cherry-go.love",
          password: "102030",
        });
        await request(app)
          .patch(paths.v1.users_clients_active)
          .set({
            Authorization: `Bearer ${token_admin}`,
          })
          .send({
            cpf,
          });
        const response = await request(app)
          .post(paths.v1.users_password_forgot)
          .send({
            email: user.email,
          });

        expect(response.status).toBe(HTTP_STATUS_CODE_SUCCESS_ENUM.NO_CONTENT);
      }, 30000);

      it("should be throw to create a new user type insides if user not exist", async () => {
        // arrange
        const [{ email }] = usersFactory.generate({
          quantity: 1,
        });

        // act

        const response = await request(app)
          .post(paths.v1.users_password_forgot)
          .send({
            email,
          });

        expect(response.status).toBe(HTTP_ERROR_CODES_ENUM.NOT_FOUND);
        expect(response.body.message).toBe(
          NOT_FOUND.USER_DOES_NOT_EXIST.message
        );
      }, 30000);
    });

    describe("Reset password - /reset", () => {
      it("should be able reset password", async () => {
        // arrange
        const [
          { name, last_name, cpf, rg, email, gender },
        ] = usersFactory.generate({
          quantity: 1,
        });

        // act
        const { body: user } = await request(app)
          .post(paths.v1.users_clients)
          .send({
            name,
            last_name,
            cpf,
            rg,
            email,
            password: "102030",
            password_confirm: "102030",
            gender,
            birth_date: new Date(1995, 11, 17),
          });
        const {
          body: { token: token_admin },
        } = await request(app).post(paths.v1.users_sessions).send({
          email: "admin@cherry-go.love",
          password: "102030",
        });
        await request(app)
          .patch(paths.v1.users_clients_active)
          .set({
            Authorization: `Bearer ${token_admin}`,
          })
          .send({
            cpf,
          });

        await connection.getRepository("users_tokens").delete({});

        await request(app).post(paths.v1.users_password_forgot).send({
          email: user.email,
        });

        const { refresh_token } = (await connection
          .getRepository("users_tokens")
          .findOne({ where: { user_id: user.id } })) as UserTokens;

        const response = await request(app)
          .post(paths.v1.users_password_reset)
          .query({ token: refresh_token })
          .send({
            password: "102030",
          });

        expect(response.status).toBe(HTTP_STATUS_CODE_SUCCESS_ENUM.NO_CONTENT);
      }, 30000);

      it("should be throw to create a insides if reset not exist", async () => {
        // arrange
        const [
          { name, last_name, cpf, rg, email, gender },
        ] = usersFactory.generate({
          quantity: 1,
        });

        // act
        const { body: user } = await request(app)
          .post(paths.v1.users_clients)
          .send({
            name,
            last_name,
            cpf,
            rg,
            email,
            password: "102030",
            password_confirm: "102030",
            gender,
            birth_date: new Date(1995, 11, 17),
          });
        const {
          body: { token: token_admin },
        } = await request(app).post(paths.v1.users_sessions).send({
          email: "admin@cherry-go.love",
          password: "102030",
        });
        await request(app)
          .patch(paths.v1.users_clients_active)
          .set({
            Authorization: `Bearer ${token_admin}`,
          })
          .send({
            cpf,
          });
        await request(app).post(paths.v1.users_password_forgot).send({
          email: user.email,
        });

        const response = await request(app)
          .post(paths.v1.users_password_reset)
          .query({ token: "invalid token" })
          .send({
            password: "102030",
          });

        expect(response.status).toBe(HTTP_ERROR_CODES_ENUM.FORBIDDEN);
        expect(response.body.message).toBe(FORBIDDEN.TOKEN_INVALID.message);
      }, 30000);

      // TODO:: implementar data mockada
      // it("should be throw to create a insides if expired token", async () => {
      //   // arrange
      //   const [
      //     { name, last_name, cpf, rg, email, gender },
      //   ] = usersFactory.generate({
      //     quantity: 1,
      //   });

      //   // act
      //   const { body: user } = await request(app)
      //     .post(paths.v1.users_clients)
      //     .send({
      //       name,
      //       last_name,
      //       cpf,
      //       rg,
      //       email,
      //       password: "102030",
      //       password_confirm: "102030",
      //       gender,
      //       birth_date: new Date(1995, 11, 17),
      //     });
      //   const {
      //     body: { token: token_admin },
      //   } = await request(app).post(paths.v1.users_sessions).send({
      //     email: "admin@cherry-go.love",
      //     password: "102030",
      //   });
      //   await request(app)
      //     .patch(paths.v1.users_clients_active)
      //     .set({
      //       Authorization: `Bearer ${token_admin}`,
      //     })
      //     .send({
      //       cpf,
      //     });
      //   await request(app).post(paths.v1.users_password_forgot).send({
      //     email: user.email,
      //   });

      //   await request(app).post(paths.v1.users_password_forgot).send({
      //     email: user.email,
      //   });

      //   const response = await request(app)
      //     .post(paths.v1.users_password_reset)
      //     .query({ token: "invalid token" })
      //     .send({
      //       password: "102030",
      //     });

      //   expect(response.status).toBe(HTTP_ERROR_CODES_ENUM.FORBIDDEN);
      //   expect(response.body.message).toBe(FORBIDDEN.TOKEN_INVALID.message);
      // }, 30000);
    });
  });
});
