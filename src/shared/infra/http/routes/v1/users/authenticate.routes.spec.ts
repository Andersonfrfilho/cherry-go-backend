import request from "supertest";
import { Connection, createConnections } from "typeorm";

import { orm_test } from "@root/ormconfig.test";
import { NOT_FOUND, UNAUTHORIZED } from "@shared/errors/constants";
import { HTTP_ERROR_CODES_ENUM } from "@shared/errors/enums";
import { app } from "@shared/infra/http/app";
import { HTTP_STATUS_CODE_SUCCESS_ENUM } from "@shared/infra/http/enums/HttpSuccessCode.enum";
import { UsersFactory } from "@shared/infra/typeorm/factories";

let connection: Connection;
let seed: Connection;
describe("Authenticated routes", () => {
  const usersFactory = new UsersFactory();

  const paths = {
    v1: {
      users_sessions: "/v1/users/sessions",
      users_refresh_token: "/v1/users/refresh_token",
      users_active: "/v1/users/clients/active",
      users_clients: "/v1/users/clients",
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
  describe("Sessions", () => {
    it("should be able to create a authenticate", async () => {
      // arrange
      const [
        { name, last_name, cpf, rg, email, gender },
      ] = usersFactory.generate({
        quantity: 1,
      });

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
        .patch(paths.v1.users_active)
        .set({
          Authorization: `Bearer ${token_admin}`,
        })
        .send({
          cpf,
        });

      const response = await request(app).post(paths.v1.users_sessions).send({
        email,
        password: "102030",
      });

      expect(response.status).toBe(HTTP_STATUS_CODE_SUCCESS_ENUM.OK);
      expect(response.body).toEqual(
        expect.objectContaining({
          user: expect.objectContaining({
            id: expect.any(String) && response.body.user.id,
            name: expect.any(String) && name,
            last_name: expect.any(String) && last_name,
            cpf: expect.any(String) && cpf,
            rg: expect.any(String) && rg,
            email: expect.any(String) && email,
            active: expect.any(Boolean) && true,
            gender: expect.any(String) && gender,
            phones: expect.arrayContaining([]),
            addresses: expect.arrayContaining([]),
            image_profile: expect.arrayContaining([]),
            types: expect.arrayContaining([
              expect.objectContaining({
                id: expect.any(String),
                name: expect.any(String),
              }),
            ]),
            term: expect.arrayContaining([]),
            transactions: expect.arrayContaining([]),
          }),
          token: expect.any(String),
          refresh_token: expect.any(String),
        })
      );
    }, 30000);

    it("should throw able error is not exist", async () => {
      // arrange
      const [{ email }] = usersFactory.generate({
        quantity: 1,
      });

      // act
      const response = await request(app).post(paths.v1.users_sessions).send({
        email,
        password: "102030",
      });

      expect(response.status).toBe(HTTP_ERROR_CODES_ENUM.NOT_FOUND);
      expect(response.body.message).toBe(NOT_FOUND.USER_DOES_NOT_EXIST.message);
    }, 30000);

    it("should be throw error if password not match", async () => {
      // arrange
      const [
        { name, last_name, cpf, rg, email, gender },
      ] = usersFactory.generate({
        quantity: 1,
      });

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
        .patch(paths.v1.users_active)
        .set({
          Authorization: `Bearer ${token_admin}`,
        })
        .send({
          cpf,
        });

      const response = await request(app).post(paths.v1.users_sessions).send({
        email,
        password: "invalid",
      });

      expect(response.status).toBe(HTTP_ERROR_CODES_ENUM.UNAUTHORIZED);
      expect(response.body.message).toBe(
        UNAUTHORIZED.USER_PASSWORD_DOES_MATCH.message
      );
    }, 30000);
  });

  describe("Refresh Token", () => {
    it("should be able to create a refresh-token with body", async () => {
      // arrange
      const [
        { name, last_name, cpf, rg, email, gender },
      ] = usersFactory.generate({
        quantity: 1,
      });

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
        .patch(paths.v1.users_active)
        .set({
          Authorization: `Bearer ${token_admin}`,
        })
        .send({
          cpf,
        });

      const {
        body: { refresh_token },
      } = await request(app).post(paths.v1.users_sessions).send({
        email,
        password: "102030",
      });

      const response = await request(app)
        .post(paths.v1.users_refresh_token)
        .send({
          token: refresh_token,
        });

      expect(response.status).toBe(HTTP_STATUS_CODE_SUCCESS_ENUM.OK);
      expect(response.body).toEqual(
        expect.objectContaining({
          token: expect.any(String),
          refresh_token: expect.any(String),
        })
      );
    }, 30000);

    it("should be able to create a refresh-token with x-access-tokens", async () => {
      // arrange
      const [
        { name, last_name, cpf, rg, email, gender },
      ] = usersFactory.generate({
        quantity: 1,
      });

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
        .patch(paths.v1.users_active)
        .set({
          Authorization: `Bearer ${token_admin}`,
        })
        .send({
          cpf,
        });

      const {
        body: { refresh_token },
      } = await request(app).post(paths.v1.users_sessions).send({
        email,
        password: "102030",
      });

      const response = await request(app)
        .post(paths.v1.users_refresh_token)
        .set({
          "x-access-tokens": refresh_token,
        });

      expect(response.status).toBe(HTTP_STATUS_CODE_SUCCESS_ENUM.OK);
      expect(response.body).toEqual(
        expect.objectContaining({
          token: expect.any(String),
          refresh_token: expect.any(String),
        })
      );
    }, 30000);

    it("should be able to create a refresh-token with query token", async () => {
      // arrange
      const [
        { name, last_name, cpf, rg, email, gender },
      ] = usersFactory.generate({
        quantity: 1,
      });

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
        .patch(paths.v1.users_active)
        .set({
          Authorization: `Bearer ${token_admin}`,
        })
        .send({
          cpf,
        });

      const {
        body: { refresh_token },
      } = await request(app).post(paths.v1.users_sessions).send({
        email,
        password: "102030",
      });

      const response = await request(app)
        .post(paths.v1.users_refresh_token)
        .query({
          token: refresh_token,
        });

      expect(response.status).toBe(HTTP_STATUS_CODE_SUCCESS_ENUM.OK);
      expect(response.body).toEqual(
        expect.objectContaining({
          token: expect.any(String),
          refresh_token: expect.any(String),
        })
      );
    }, 30000);

    it("should be throw erro is refresh_token not exist", async () => {
      // arrange
      const [
        { name, last_name, cpf, rg, email, gender },
      ] = usersFactory.generate({
        quantity: 1,
      });

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
        .patch(paths.v1.users_active)
        .set({
          Authorization: `Bearer ${token_admin}`,
        })
        .send({
          cpf,
        });

      const {
        body: { refresh_token },
      } = await request(app).post(paths.v1.users_sessions).send({
        email,
        password: "102030",
      });

      await connection.getRepository("users_tokens").delete({});

      const response = await request(app)
        .post(paths.v1.users_refresh_token)
        .query({
          token: refresh_token,
        });

      expect(response.status).toBe(HTTP_ERROR_CODES_ENUM.NOT_FOUND);
      expect(response.body.message).toEqual(
        NOT_FOUND.REFRESH_TOKEN_DOES_NOT_EXIST.message
      );
    }, 30000);
  });
});
