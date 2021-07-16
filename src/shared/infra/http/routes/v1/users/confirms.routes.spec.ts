import request from "supertest";
import { Connection, createConnections } from "typeorm";

import { CODE_STAGING_TEST } from "@modules/accounts/constants/PhoneConfirmCode.const";
import { UserTokens } from "@modules/accounts/infra/typeorm/entities/UserTokens";
import { orm_test } from "@root/ormconfig.test";
import {
  FORBIDDEN,
  METHOD_NOT_ALLOWED,
  NOT_FOUND,
  UNAUTHORIZED,
  UNPROCESSABLE_ENTITY,
} from "@shared/errors/constants";
import { HTTP_ERROR_CODES_ENUM } from "@shared/errors/enums";
import { app } from "@shared/infra/http/app";
import { HTTP_STATUS_CODE_SUCCESS_ENUM } from "@shared/infra/http/enums/HttpSuccessCode.enum";
import { PhonesFactory, UsersFactory } from "@shared/infra/typeorm/factories";

let connection: Connection;
let seed: Connection;

describe("Confirm routes", () => {
  const usersFactory = new UsersFactory();
  const phonesFactory = new PhonesFactory();

  const paths = {
    v1: {
      users_clients: "/v1/users/clients",
      users_sessions: "/v1/users/sessions",
      users_clients_active: "/v1/users/clients/active",
      users_confirm_mail: "/v1/users/confirm/mail",
      users_confirm_phone: "/v1/users/confirm/phone",
      users_clients_phones: "/v1/users/clients/phones",
      users_confirm_term: "/v1/users/confirm/term",
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
  describe("GET", () => {
    describe("Confirm email - /mail", () => {
      it("should be able to confirm a new user", async () => {
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
            gender,
            email,
            password: "102030",
            password_confirm: "102030",
            birth_date: new Date(1995, 11, 17),
          });

        const token = (await connection
          .getRepository("users_tokens")
          .findOne({ where: { user_id: user.id } })) as UserTokens;

        const response = await request(app)
          .get(paths.v1.users_confirm_mail)
          .query({
            token: token.refresh_token,
          });
        expect(response.status).toBe(HTTP_STATUS_CODE_SUCCESS_ENUM.NO_CONTENT);
      }, 30000);

      it("should be return error BAD REQUEST schema failed", async () => {
        // arrange
        const response = await request(app).get(paths.v1.users_confirm_mail);

        // act
        expect(response.status).toBe(HTTP_ERROR_CODES_ENUM.BAD_REQUEST);
      }, 30000);

      it("should be able not confirm mail if token does not exist", async () => {
        // arrange
        // act
        const response = await request(app)
          .get(paths.v1.users_confirm_mail)
          .query({
            token: "invalid_token",
          });

        expect(response.status).toBe(HTTP_ERROR_CODES_ENUM.FORBIDDEN);
        expect(response.body.message).toBe(FORBIDDEN.TOKEN_INVALID.message);
      }, 30000);

      // TODO:: implementar jest com mock de data
      // it("should be able not confirm mail if token does is expired", async () => {
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
      //       gender,
      //       email,
      //       password: "102030",
      //       password_confirm: "102030",
      //       birth_date: new Date(1995, 11, 17),
      //     });

      //   const token = (await connection
      //     .getRepository("users_tokens")
      //     .findOne({ where: { user_id: user.id } })) as UserTokens;

      //   const response = await request(app)
      //     .get(paths.v1.users_confirm_mail)
      //     .query({
      //       token: token.refresh_token,
      //     });

      //   expect(response.status).toBe(HTTP_ERROR_CODES_ENUM.UNAUTHORIZED);
      //   expect(response.body.message).toBe(UNAUTHORIZED.TOKEN_EXPIRED.message);
      // }, 30000);
    });
  });

  describe("Patch", () => {
    describe("Confirm phone for client /phone", () => {
      it("should be able to confirm a phone", async () => {
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

        const [{ country_code, ddd, number }] = phonesFactory.generate({
          quantity: 1,
        });

        const { body: phone } = await request(app)
          .patch(paths.v1.users_clients_phones)
          .set({
            Authorization: `Bearer ${token}`,
          })
          .send({
            country_code,
            ddd,
            number,
          });

        const response = await request(app)
          .patch(paths.v1.users_confirm_phone)
          .set({
            Authorization: `Bearer ${token}`,
          })
          .send({
            token: phone.token,
            code: number.slice(CODE_STAGING_TEST),
          });
        expect(response.status).toBe(HTTP_STATUS_CODE_SUCCESS_ENUM.NO_CONTENT);
      }, 30000);

      it("should throw error to create a confirm phone without token", async () => {
        // arrange
        // act

        const response = await request(app).patch(paths.v1.users_confirm_phone);

        expect(response.status).toBe(HTTP_ERROR_CODES_ENUM.UNAUTHORIZED);
        expect(response.body.message).toBe(
          UNAUTHORIZED.TOKEN_IS_MISSING.message
        );
      }, 30000);

      it("should throw error to create a confirm phone with invalid token", async () => {
        // arrange
        // act
        const response = await request(app)
          .patch(paths.v1.users_confirm_phone)
          .set({
            Authorization: `Bearer invalid`,
          });

        expect(response.status).toBe(HTTP_ERROR_CODES_ENUM.UNAUTHORIZED);
        expect(response.body.message).toBe(
          UNAUTHORIZED.TOKEN_IS_INVALID.message
        );
      }, 30000);

      it("should be throw error if user is not active", async () => {
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
          body: { token },
        } = await request(app).post(paths.v1.users_sessions).send({
          email,
          password: "102030",
        });

        const response = await request(app)
          .patch(paths.v1.users_confirm_phone)
          .set({
            Authorization: `Bearer ${token}`,
          });

        expect(response.status).toBe(HTTP_ERROR_CODES_ENUM.FORBIDDEN);
        expect(response.body.message).toBe(
          FORBIDDEN.USER_IS_NOT_ACTIVE.message
        );
      }, 30000);

      it("should be throw not to confirm a diff user solicitation", async () => {
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

        const [{ country_code, ddd, number }] = phonesFactory.generate({
          quantity: 1,
        });

        const { body: phone } = await request(app)
          .patch(paths.v1.users_clients_phones)
          .set({
            Authorization: `Bearer ${token}`,
          })
          .send({
            country_code,
            ddd,
            number,
          });

        const response = await request(app)
          .patch(paths.v1.users_confirm_phone)
          .set({
            Authorization: `Bearer ${token_admin}`,
          })
          .send({
            token: phone.token,
            code: number.slice(CODE_STAGING_TEST),
          });
        expect(response.status).toBe(HTTP_ERROR_CODES_ENUM.METHOD_NOT_ALLOWED);
        expect(response.body.message).toBe(
          METHOD_NOT_ALLOWED.NOT_ALLOWED.message
        );
      }, 30000);

      // TODO:: implementar jest com mock de data
      // it("should be throw a error expired code", async () => {
      //   // arrange
      //   const [
      //     { name, last_name, cpf, rg, email, gender },
      //   ] = usersFactory.generate({
      //     quantity: 1,
      //   });

      //   // act
      //   await request(app)
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

      //   const {
      //     body: { token },
      //   } = await request(app).post(paths.v1.users_sessions).send({
      //     email,
      //     password: "102030",
      //   });

      //   const [{ country_code, ddd, number }] = phonesFactory.generate({
      //     quantity: 1,
      //   });

      //   const { body: phone } = await request(app)
      //     .patch(paths.v1.users_clients_phones)
      //     .set({
      //       Authorization: `Bearer ${token}`,
      //     })
      //     .send({
      //       country_code,
      //       ddd,
      //       number,
      //     });

      //   const response = await request(app)
      //     .patch(paths.v1.users_confirm_phone)
      //     .set({
      //       Authorization: `Bearer ${token_admin}`,
      //     })
      //     .send({
      //       token: phone.token,
      //       code: number.slice(CODE_STAGING_TEST),
      //     });
      //   expect(response.status).toBe(HTTP_ERROR_CODES_ENUM.METHOD_NOT_ALLOWED);
      //   expect(response.body.message).toBe(
      //     METHOD_NOT_ALLOWED.NOT_ALLOWED.message
      //   );
      // }, 30000);

      it("should be throw not to confirm a diff code solicitation", async () => {
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

        const [{ country_code, ddd, number }] = phonesFactory.generate({
          quantity: 1,
        });

        const { body: phone } = await request(app)
          .patch(paths.v1.users_clients_phones)
          .set({
            Authorization: `Bearer ${token}`,
          })
          .send({
            country_code,
            ddd,
            number,
          });

        const response = await request(app)
          .patch(paths.v1.users_confirm_phone)
          .set({
            Authorization: `Bearer ${token}`,
          })
          .send({
            token: phone.token,
            code: "DOWN",
          });
        expect(response.status).toBe(
          HTTP_ERROR_CODES_ENUM.UNPROCESSABLE_ENTITY
        );
        expect(response.body.message).toBe(
          UNPROCESSABLE_ENTITY.CODE_INCORRECT.message
        );
      }, 30000);
    });
  });

  describe("Post", () => {
    describe("Confirm terms for client /term", () => {
      it("should be able to accept term", async () => {
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
          .post(paths.v1.users_confirm_term)
          .set({
            Authorization: `Bearer ${token}`,
          })
          .send({
            accept: true,
          });

        expect(response.status).toBe(HTTP_STATUS_CODE_SUCCESS_ENUM.NO_CONTENT);
      }, 30000);

      it("should throw error to create a confirm term without token", async () => {
        // arrange
        // act
        const response = await request(app).post(paths.v1.users_confirm_term);

        expect(response.status).toBe(HTTP_ERROR_CODES_ENUM.UNAUTHORIZED);
        expect(response.body.message).toBe(
          UNAUTHORIZED.TOKEN_IS_MISSING.message
        );
      }, 30000);

      it("should throw error to create a confirm phone with invalid token", async () => {
        // arrange
        // act
        const response = await request(app)
          .post(paths.v1.users_confirm_term)
          .set({
            Authorization: `Bearer invalid`,
          });

        expect(response.status).toBe(HTTP_ERROR_CODES_ENUM.UNAUTHORIZED);
        expect(response.body.message).toBe(
          UNAUTHORIZED.TOKEN_IS_INVALID.message
        );
      }, 30000);

      it("should be throw error if user is not active", async () => {
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
          body: { token },
        } = await request(app).post(paths.v1.users_sessions).send({
          email,
          password: "102030",
        });

        const response = await request(app)
          .post(paths.v1.users_confirm_term)
          .set({
            Authorization: `Bearer ${token}`,
          });

        expect(response.status).toBe(HTTP_ERROR_CODES_ENUM.FORBIDDEN);
        expect(response.body.message).toBe(
          FORBIDDEN.USER_IS_NOT_ACTIVE.message
        );
      }, 30000);

      it("should be throw error if user is not exist", async () => {
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

        await connection
          .getRepository("users_types_users")
          .createQueryBuilder()
          .delete()
          .from("users_types_users")
          .where("user_id = :id", { id: user.id })
          .execute();

        await connection.getRepository("users").delete(user.id);

        const response = await request(app)
          .post(paths.v1.users_confirm_term)
          .set({
            Authorization: `Bearer ${token}`,
          })
          .send({
            accept: true,
          });

        expect(response.status).toBe(HTTP_ERROR_CODES_ENUM.NOT_FOUND);
        expect(response.body.message).toBe(
          NOT_FOUND.USER_DOES_NOT_EXIST.message
        );
      }, 30000);
    });
  });
});
