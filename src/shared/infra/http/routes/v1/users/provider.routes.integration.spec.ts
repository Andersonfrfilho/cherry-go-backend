import faker from "faker";
import request from "supertest";
import { Connection, createConnections } from "typeorm";

import { DAYS_WEEK_ENUM } from "@modules/accounts/enums/DaysProviders.enum";
import { orm_test } from "@root/ormconfig.test";
import { FORBIDDEN, NOT_FOUND, UNAUTHORIZED } from "@shared/errors/constants";
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
      users_providers: "/v1/users/providers",
      users_clients_active: "/v1/users/clients/active",
      users_providers_sessions: "/v1/users/providers/sessions",
      users_providers_days: "/v1/users/providers/days",
      users_providers_hours: "/v1/users/providers/hours",
      users_providers_services: "/v1/users/providers/services",
      users_providers_payment_types: "/v1/users/providers/payments_types",
      users_providers_transport_types: "/v1/users/providers/transport_types",
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
  describe("Patch", () => {
    describe("Provider - /", () => {
      it("should be able create provider perfil for user client", async () => {
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
          .patch(paths.v1.users_providers)
          .set({
            Authorization: `Bearer ${token}`,
          });

        expect(response.status).toBe(HTTP_STATUS_CODE_SUCCESS_ENUM.NO_CONTENT);
      }, 30000);

      it("should throw error to upload image profile without token", async () => {
        // arrange
        // act
        const response = await request(app).patch(paths.v1.users_providers);

        expect(response.status).toBe(HTTP_ERROR_CODES_ENUM.UNAUTHORIZED);
        expect(response.body.message).toBe(
          UNAUTHORIZED.TOKEN_IS_MISSING.message
        );
      }, 30000);

      it("should throw error to create a document front with invalid token", async () => {
        // arrange
        // act
        const response = await request(app)
          .patch(paths.v1.users_providers)
          .set({
            Authorization: "Bearer invalid",
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
          .patch(paths.v1.users_providers)
          .set({
            Authorization: `Bearer ${token}`,
          });

        expect(response.status).toBe(HTTP_ERROR_CODES_ENUM.FORBIDDEN);
        expect(response.body.message).toBe(
          FORBIDDEN.USER_IS_NOT_ACTIVE.message
        );
      }, 30000);

      it("should be throw to upload profile image, if user not exist", async () => {
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
          .patch(paths.v1.users_providers)
          .set({
            Authorization: `Bearer ${token}`,
          });

        expect(response.status).toBe(HTTP_ERROR_CODES_ENUM.NOT_FOUND);
        expect(response.body.message).toBe(
          NOT_FOUND.USER_DOES_NOT_EXIST.message
        );
      }, 30000);
    });

    describe("Provider - /session", () => {
      it("should be able create provider client", async () => {
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

        await request(app)
          .patch(paths.v1.users_providers)
          .set({
            Authorization: `Bearer ${token}`,
          });

        const response = await request(app)
          .post(paths.v1.users_providers_sessions)
          .send({
            email,
            password: "102030",
          });

        expect(response.status).toBe(HTTP_STATUS_CODE_SUCCESS_ENUM.OK);
      }, 30000);

      it("should be throw error create provider client not exist", async () => {
        // arrange
        const [{ email }] = usersFactory.generate({
          quantity: 1,
        });

        // act
        const response = await request(app)
          .post(paths.v1.users_providers_sessions)
          .send({
            email,
            password: "102030",
          });

        expect(response.status).toBe(HTTP_ERROR_CODES_ENUM.NOT_FOUND);
        expect(response.body.message).toBe(
          NOT_FOUND.PROVIDER_DOES_NOT_EXIST.message
        );
      }, 30000);

      it("should be throw error create provider client is not active", async () => {
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

        const response = await request(app)
          .post(paths.v1.users_providers_sessions)
          .send({
            email,
            password: "102030",
          });

        expect(response.status).toBe(HTTP_ERROR_CODES_ENUM.FORBIDDEN);
        expect(response.body.message).toBe(
          FORBIDDEN.PROVIDER_IS_NOT_ACTIVE.message
        );
      }, 30000);

      it("should be throw error create provider client is unauthorized password does match", async () => {
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

        await request(app)
          .patch(paths.v1.users_providers)
          .set({
            Authorization: `Bearer ${token}`,
          });

        const response = await request(app)
          .post(paths.v1.users_providers_sessions)
          .send({
            email,
            password: "invalid_pw",
          });

        expect(response.status).toBe(HTTP_ERROR_CODES_ENUM.UNAUTHORIZED);
        expect(response.body.message).toBe(
          UNAUTHORIZED.USER_PASSWORD_DOES_MATCH.message
        );
      }, 30000);
    });

    describe("Provider - /days", () => {
      it("should be able create provider days availability client", async () => {
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

        await request(app)
          .patch(paths.v1.users_providers)
          .set({
            Authorization: `Bearer ${token}`,
          });

        const {
          body: { token: token_provider },
        } = await request(app).post(paths.v1.users_providers_sessions).send({
          email,
          password: "102030",
        });

        const response = await request(app)
          .patch(paths.v1.users_providers_days)
          .set({
            Authorization: `Bearer ${token_provider}`,
          })
          .send({
            days: [
              DAYS_WEEK_ENUM.MONDAY,
              DAYS_WEEK_ENUM.TUESDAY,
              DAYS_WEEK_ENUM.WEDNESDAY,
              DAYS_WEEK_ENUM.THURSDAY,
              DAYS_WEEK_ENUM.FRIDAY,
            ],
          });

        expect(response.status).toBe(HTTP_STATUS_CODE_SUCCESS_ENUM.NO_CONTENT);
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
          .patch(paths.v1.users_providers_days)
          .set({
            Authorization: `Bearer ${token}`,
          });

        expect(response.status).toBe(HTTP_ERROR_CODES_ENUM.FORBIDDEN);
        expect(response.body.message).toBe(
          FORBIDDEN.USER_IS_NOT_ACTIVE.message
        );
      }, 30000);

      it("should be throw error if user is not provider", async () => {
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
          .patch(paths.v1.users_providers_days)
          .set({
            Authorization: `Bearer ${token}`,
          })
          .send({
            days: [
              DAYS_WEEK_ENUM.MONDAY,
              DAYS_WEEK_ENUM.TUESDAY,
              DAYS_WEEK_ENUM.WEDNESDAY,
              DAYS_WEEK_ENUM.THURSDAY,
              DAYS_WEEK_ENUM.FRIDAY,
            ],
          });
        expect(response.status).toBe(HTTP_ERROR_CODES_ENUM.FORBIDDEN);
        expect(response.body.message).toBe(
          FORBIDDEN.PROVIDER_IS_NOT_ACTIVE.message
        );
      }, 30000);

      it("should be able create provider days availability client not exist", async () => {
        // arrange
        const [
          { name, last_name, cpf, rg, email, gender },
        ] = usersFactory.generate({
          quantity: 1,
        });

        // act
        const { body: provider } = await request(app)
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

        await request(app)
          .patch(paths.v1.users_providers)
          .set({
            Authorization: `Bearer ${token}`,
          });

        const {
          body: { token: token_provider },
        } = await request(app).post(paths.v1.users_providers_sessions).send({
          email,
          password: "102030",
        });

        await connection
          .getRepository("users_types_users")
          .createQueryBuilder()
          .delete()
          .from("users_types_users")
          .where("user_id = :id", { id: provider.id })
          .execute();

        await connection.getRepository("users").delete(provider.id);

        const response = await request(app)
          .patch(paths.v1.users_providers_days)
          .set({
            Authorization: `Bearer ${token_provider}`,
          })
          .send({
            days: [
              DAYS_WEEK_ENUM.MONDAY,
              DAYS_WEEK_ENUM.TUESDAY,
              DAYS_WEEK_ENUM.WEDNESDAY,
              DAYS_WEEK_ENUM.THURSDAY,
              DAYS_WEEK_ENUM.FRIDAY,
            ],
          });
        expect(response.status).toBe(HTTP_ERROR_CODES_ENUM.NOT_FOUND);
        expect(response.body.message).toBe(
          NOT_FOUND.PROVIDER_DOES_NOT_EXIST.message
        );
      }, 30000);
    });

    describe("Provider - /hours", () => {
      it("should be able create provider hours availability client", async () => {
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

        await request(app)
          .patch(paths.v1.users_providers)
          .set({
            Authorization: `Bearer ${token}`,
          });

        const {
          body: { token: token_provider },
        } = await request(app).post(paths.v1.users_providers_sessions).send({
          email,
          password: "102030",
        });

        const response = await request(app)
          .patch(paths.v1.users_providers_hours)
          .set({
            Authorization: `Bearer ${token_provider}`,
          })
          .send({
            times: [
              {
                start_time: faker.phone.phoneNumber("##:##"),
                end_time: faker.phone.phoneNumber("##:##"),
              },
              {
                start_time: faker.phone.phoneNumber("##:##"),
                end_time: faker.phone.phoneNumber("##:##"),
              },
              {
                start_time: faker.phone.phoneNumber("##:##"),
                end_time: faker.phone.phoneNumber("##:##"),
              },
            ],
          });

        expect(response.status).toBe(HTTP_STATUS_CODE_SUCCESS_ENUM.NO_CONTENT);
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
          .patch(paths.v1.users_providers_hours)
          .set({
            Authorization: `Bearer ${token}`,
          });

        expect(response.status).toBe(HTTP_ERROR_CODES_ENUM.FORBIDDEN);
        expect(response.body.message).toBe(
          FORBIDDEN.USER_IS_NOT_ACTIVE.message
        );
      }, 30000);

      it("should be throw error if user is not provider", async () => {
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
          .patch(paths.v1.users_providers_hours)
          .set({
            Authorization: `Bearer ${token}`,
          })
          .send({
            times: [
              {
                start_time: faker.phone.phoneNumber("##:##"),
                end_time: faker.phone.phoneNumber("##:##"),
              },
              {
                start_time: faker.phone.phoneNumber("##:##"),
                end_time: faker.phone.phoneNumber("##:##"),
              },
              {
                start_time: faker.phone.phoneNumber("##:##"),
                end_time: faker.phone.phoneNumber("##:##"),
              },
            ],
          });
        expect(response.status).toBe(HTTP_ERROR_CODES_ENUM.FORBIDDEN);
        expect(response.body.message).toBe(
          FORBIDDEN.PROVIDER_IS_NOT_ACTIVE.message
        );
      }, 30000);

      it("should be able create provider hours availability client not exist", async () => {
        // arrange
        const [
          { name, last_name, cpf, rg, email, gender },
        ] = usersFactory.generate({
          quantity: 1,
        });

        // act
        const { body: provider } = await request(app)
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

        await request(app)
          .patch(paths.v1.users_providers)
          .set({
            Authorization: `Bearer ${token}`,
          });

        const {
          body: { token: token_provider },
        } = await request(app).post(paths.v1.users_providers_sessions).send({
          email,
          password: "102030",
        });

        await connection
          .getRepository("users_types_users")
          .createQueryBuilder()
          .delete()
          .from("users_types_users")
          .where("user_id = :id", { id: provider.id })
          .execute();

        await connection.getRepository("users").delete(provider.id);

        const response = await request(app)
          .patch(paths.v1.users_providers_hours)
          .set({
            Authorization: `Bearer ${token_provider}`,
          })
          .send({
            times: [
              {
                start_time: faker.phone.phoneNumber("##:##"),
                end_time: faker.phone.phoneNumber("##:##"),
              },
              {
                start_time: faker.phone.phoneNumber("##:##"),
                end_time: faker.phone.phoneNumber("##:##"),
              },
              {
                start_time: faker.phone.phoneNumber("##:##"),
                end_time: faker.phone.phoneNumber("##:##"),
              },
            ],
          });
        expect(response.status).toBe(HTTP_ERROR_CODES_ENUM.NOT_FOUND);
        expect(response.body.message).toBe(
          NOT_FOUND.PROVIDER_DOES_NOT_EXIST.message
        );
      }, 30000);
    });

    describe("Provider - /services", () => {
      it("should be able create provider services availability client", async () => {
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

        await request(app)
          .patch(paths.v1.users_providers)
          .set({
            Authorization: `Bearer ${token}`,
          });

        const {
          body: { token: token_provider },
        } = await request(app).post(paths.v1.users_providers_sessions).send({
          email,
          password: "102030",
        });

        const response = await request(app)
          .patch(paths.v1.users_providers_services)
          .set({
            Authorization: `Bearer ${token_provider}`,
          })
          .send({
            name: faker.name.firstName(),
            amount: faker.datatype.number({ min: 1, max: 999 }),
            duration: faker.datatype.number({ min: 1800000, max: 3600000 }),
          });

        expect(response.status).toBe(HTTP_STATUS_CODE_SUCCESS_ENUM.NO_CONTENT);
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
          .patch(paths.v1.users_providers_services)
          .set({
            Authorization: `Bearer ${token}`,
          });

        expect(response.status).toBe(HTTP_ERROR_CODES_ENUM.FORBIDDEN);
        expect(response.body.message).toBe(
          FORBIDDEN.USER_IS_NOT_ACTIVE.message
        );
      }, 30000);

      it("should be throw error if user is not services provider", async () => {
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
          .patch(paths.v1.users_providers_services)
          .set({
            Authorization: `Bearer ${token}`,
          })
          .send({
            name: faker.name.firstName(),
            amount: faker.datatype.number({ min: 1, max: 999 }),
            duration: faker.datatype.number({ min: 1800000, max: 3600000 }),
          });
        expect(response.status).toBe(HTTP_ERROR_CODES_ENUM.FORBIDDEN);
        expect(response.body.message).toBe(
          FORBIDDEN.PROVIDER_IS_NOT_ACTIVE.message
        );
      }, 30000);

      it("should be able create provider services availability client not exist", async () => {
        // arrange
        const [
          { name, last_name, cpf, rg, email, gender },
        ] = usersFactory.generate({
          quantity: 1,
        });

        // act
        const { body: provider } = await request(app)
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

        await request(app)
          .patch(paths.v1.users_providers)
          .set({
            Authorization: `Bearer ${token}`,
          });

        const {
          body: { token: token_provider },
        } = await request(app).post(paths.v1.users_providers_sessions).send({
          email,
          password: "102030",
        });

        await connection
          .getRepository("users_types_users")
          .createQueryBuilder()
          .delete()
          .from("users_types_users")
          .where("user_id = :id", { id: provider.id })
          .execute();

        await connection.getRepository("users").delete(provider.id);

        const response = await request(app)
          .patch(paths.v1.users_providers_services)
          .set({
            Authorization: `Bearer ${token_provider}`,
          })
          .send({
            name: faker.name.firstName(),
            amount: faker.datatype.number({ min: 1, max: 999 }),
            duration: faker.datatype.number({ min: 1800000, max: 3600000 }),
          });

        expect(response.status).toBe(HTTP_ERROR_CODES_ENUM.NOT_FOUND);
        expect(response.body.message).toBe(
          NOT_FOUND.PROVIDER_DOES_NOT_EXIST.message
        );
      }, 30000);
    });

    describe("Provider - /payments_types", () => {
      it("should be able create provider payments types availability client", async () => {
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

        await request(app)
          .patch(paths.v1.users_providers)
          .set({
            Authorization: `Bearer ${token}`,
          });

        const {
          body: { token: token_provider },
        } = await request(app).post(paths.v1.users_providers_sessions).send({
          email,
          password: "102030",
        });

        const response = await request(app)
          .patch(paths.v1.users_providers_payment_types)
          .set({
            Authorization: `Bearer ${token_provider}`,
          })
          .send({
            payments_types: ["money", "credit", "pix", "debit"],
          });

        expect(response.status).toBe(HTTP_STATUS_CODE_SUCCESS_ENUM.NO_CONTENT);
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
          .patch(paths.v1.users_providers_services)
          .set({
            Authorization: `Bearer ${token}`,
          });

        expect(response.status).toBe(HTTP_ERROR_CODES_ENUM.FORBIDDEN);
        expect(response.body.message).toBe(
          FORBIDDEN.USER_IS_NOT_ACTIVE.message
        );
      }, 30000);

      it("should be throw error if user is not payments types provider", async () => {
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
          .patch(paths.v1.users_providers_payment_types)
          .set({
            Authorization: `Bearer ${token}`,
          })
          .send({
            payments_types: ["money", "credit", "pix", "debit"],
          });

        expect(response.status).toBe(HTTP_ERROR_CODES_ENUM.FORBIDDEN);
        expect(response.body.message).toBe(
          FORBIDDEN.PROVIDER_IS_NOT_ACTIVE.message
        );
      }, 30000);

      it("should be able create provider payment types availability client not exist", async () => {
        // arrange
        const [
          { name, last_name, cpf, rg, email, gender },
        ] = usersFactory.generate({
          quantity: 1,
        });

        // act
        const { body: provider } = await request(app)
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

        await request(app)
          .patch(paths.v1.users_providers)
          .set({
            Authorization: `Bearer ${token}`,
          });

        const {
          body: { token: token_provider },
        } = await request(app).post(paths.v1.users_providers_sessions).send({
          email,
          password: "102030",
        });

        await connection
          .getRepository("users_types_users")
          .createQueryBuilder()
          .delete()
          .from("users_types_users")
          .where("user_id = :id", { id: provider.id })
          .execute();

        await connection.getRepository("users").delete(provider.id);

        const response = await request(app)
          .patch(paths.v1.users_providers_payment_types)
          .set({
            Authorization: `Bearer ${token_provider}`,
          })
          .send({
            payments_types: ["money", "credit", "pix", "debit"],
          });

        expect(response.status).toBe(HTTP_ERROR_CODES_ENUM.NOT_FOUND);
        expect(response.body.message).toBe(
          NOT_FOUND.PROVIDER_DOES_NOT_EXIST.message
        );
      }, 30000);
    });

    describe("Provider - /transport_types", () => {
      it("should be able create provider transport types availability client", async () => {
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

        await request(app)
          .patch(paths.v1.users_providers)
          .set({
            Authorization: `Bearer ${token}`,
          });

        const {
          body: { token: token_provider },
        } = await request(app).post(paths.v1.users_providers_sessions).send({
          email,
          password: "102030",
        });

        const response = await request(app)
          .patch(paths.v1.users_providers_transport_types)
          .set({
            Authorization: `Bearer ${token_provider}`,
          })
          .send({
            transport_types: [
              {
                name: "client",
              },
              {
                name: "uber",
              },
              {
                name: "provider",
                amount: 123,
              },
            ],
          });

        expect(response.status).toBe(HTTP_STATUS_CODE_SUCCESS_ENUM.NO_CONTENT);
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
          .patch(paths.v1.users_providers_transport_types)
          .set({
            Authorization: `Bearer ${token}`,
          });

        expect(response.status).toBe(HTTP_ERROR_CODES_ENUM.FORBIDDEN);
        expect(response.body.message).toBe(
          FORBIDDEN.USER_IS_NOT_ACTIVE.message
        );
      }, 30000);

      it("should be throw error if user is not services provider", async () => {
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
          .patch(paths.v1.users_providers_transport_types)
          .set({
            Authorization: `Bearer ${token}`,
          })
          .send({
            transport_types: [
              {
                name: "client",
              },
              {
                name: "uber",
              },
              {
                name: "provider",
                amount: 123,
              },
            ],
          });

        expect(response.status).toBe(HTTP_ERROR_CODES_ENUM.FORBIDDEN);
        expect(response.body.message).toBe(
          FORBIDDEN.PROVIDER_IS_NOT_ACTIVE.message
        );
      }, 30000);

      it("should be able create provider services client not exist", async () => {
        // arrange
        const [
          { name, last_name, cpf, rg, email, gender },
        ] = usersFactory.generate({
          quantity: 1,
        });

        // act
        const { body: provider } = await request(app)
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

        await request(app)
          .patch(paths.v1.users_providers)
          .set({
            Authorization: `Bearer ${token}`,
          });

        const {
          body: { token: token_provider },
        } = await request(app).post(paths.v1.users_providers_sessions).send({
          email,
          password: "102030",
        });

        await connection
          .getRepository("users_types_users")
          .createQueryBuilder()
          .delete()
          .from("users_types_users")
          .where("user_id = :id", { id: provider.id })
          .execute();

        await connection.getRepository("users").delete(provider.id);

        const response = await request(app)
          .patch(paths.v1.users_providers_transport_types)
          .set({
            Authorization: `Bearer ${token_provider}`,
          })
          .send({
            transport_types: [
              {
                name: "client",
              },
              {
                name: "uber",
              },
              {
                name: "provider",
                amount: 123,
              },
            ],
          });

        expect(response.status).toBe(HTTP_ERROR_CODES_ENUM.NOT_FOUND);
        expect(response.body.message).toBe(
          NOT_FOUND.PROVIDER_DOES_NOT_EXIST.message
        );
      }, 30000);
    });
  });
});
