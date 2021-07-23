import request from "supertest";
import { Connection, createConnections } from "typeorm";

import { orm_test } from "@root/ormconfig.test";
import { FORBIDDEN, NOT_FOUND, UNAUTHORIZED } from "@shared/errors/constants";
import { HTTP_ERROR_CODES_ENUM } from "@shared/errors/enums";
import { app } from "@shared/infra/http/app";
import { HTTP_STATUS_CODE_SUCCESS_ENUM } from "@shared/infra/http/enums/HttpSuccessCode.enum";
import { UsersFactory } from "@shared/infra/typeorm/factories";

let connection: Connection;
let seed: Connection;

describe("Inside routes", () => {
  const usersFactory = new UsersFactory();

  const paths = {
    v1: {
      users_clients: "/v1/users/clients",
      users_sessions: "/v1/users/sessions",
      users_clients_active: "/v1/users/clients/active",
      users_insides: "/v1/users/insides",
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
  describe("PATCH", () => {
    describe("Inside type user - /insides", () => {
      it("should be able to create a new user type insides", async () => {
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
          .patch(paths.v1.users_insides)
          .set({
            Authorization: `Bearer ${token_admin}`,
          })
          .send({
            id: user.id,
          });

        expect(response.status).toBe(HTTP_STATUS_CODE_SUCCESS_ENUM.OK);
      }, 30000);

      it("should throw error to create a document front without token", async () => {
        // arrange
        // act
        const response = await request(app).patch(paths.v1.users_insides);

        expect(response.status).toBe(HTTP_ERROR_CODES_ENUM.UNAUTHORIZED);
        expect(response.body.message).toBe(
          UNAUTHORIZED.TOKEN_IS_MISSING.message
        );
      }, 30000);

      it("should throw error to create a document front with invalid token", async () => {
        // arrange
        // act
        const response = await request(app).patch(paths.v1.users_insides).set({
          Authorization: `Bearer invalid`,
        });

        expect(response.status).toBe(HTTP_ERROR_CODES_ENUM.UNAUTHORIZED);
        expect(response.body.message).toBe(
          UNAUTHORIZED.TOKEN_IS_INVALID.message
        );
      }, 30000);

      it("should be able to create a new user type insides without admin type", async () => {
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

        const {
          body: { token },
        } = await request(app).post(paths.v1.users_sessions).send({
          email,
          password: "102030",
        });

        const response = await request(app)
          .patch(paths.v1.users_insides)
          .set({
            Authorization: `Bearer ${token}`,
          })
          .send({
            id: user.id,
          });
        expect(response.status).toBe(HTTP_ERROR_CODES_ENUM.FORBIDDEN);
        expect(response.body.message).toBe(
          FORBIDDEN.ADMIN_IS_NOT_ACTIVE.message
        );
      }, 30000);

      it("should be throw to create a new user type insides if user not exist", async () => {
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

        await connection
          .getRepository("users_types_users")
          .createQueryBuilder()
          .delete()
          .from("users_types_users")
          .where("user_id = :id", { id: user.id })
          .execute();

        await connection.getRepository("users").delete(user.id);

        const response = await request(app)
          .patch(paths.v1.users_insides)
          .set({
            Authorization: `Bearer ${token_admin}`,
          })
          .send({
            id: user.id,
          });

        expect(response.status).toBe(HTTP_ERROR_CODES_ENUM.NOT_FOUND);
        expect(response.body.message).toBe(
          NOT_FOUND.USER_DOES_NOT_EXIST.message
        );
      }, 30000);
    });
  });
});
