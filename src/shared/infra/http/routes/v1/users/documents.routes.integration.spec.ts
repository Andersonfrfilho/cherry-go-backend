import path from "path";
import request from "supertest";
import { Connection, createConnections } from "typeorm";

import { USER_DOCUMENT_VALUE_ENUM } from "@modules/accounts/enums/UserDocumentValue.enum";
import { orm_test } from "@root/ormconfig.test";
import { FORBIDDEN, UNAUTHORIZED } from "@shared/errors/constants";
import { HTTP_ERROR_CODES_ENUM } from "@shared/errors/enums";
import { app } from "@shared/infra/http/app";
import { HTTP_STATUS_CODE_SUCCESS_ENUM } from "@shared/infra/http/enums/HttpSuccessCode.enum";
import { UsersFactory } from "@shared/infra/typeorm/factories";

let connection: Connection;
let seed: Connection;

describe("Document client routes", () => {
  const usersFactory = new UsersFactory();

  const paths = {
    v1: {
      users_clients: "/v1/users/clients",
      users_sessions: "/v1/users/sessions",
      users_clients_active: "/v1/users/clients/active",
      users_confirm_mail: "/v1/users/confirm/mail",
      users_confirm_phone: "/v1/users/confirm/phone",
      users_clients_phones: "/v1/users/clients/phones",
      users_confirm_term: "/v1/users/confirm/term",
      users_clients_documents_image: "/v1/users/documents/image",
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
    describe("Document upload - documents/image", () => {
      it("should be able to create a new document image front", async () => {
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

        await request(app)
          .post(paths.v1.users_clients_documents_image)
          .set({
            Authorization: `Bearer ${token}`,
          })
          .attach("document", path_file)
          .field("description", USER_DOCUMENT_VALUE_ENUM.FRONT)
          .then((res) => {
            expect(res.status).toBe(HTTP_STATUS_CODE_SUCCESS_ENUM.NO_CONTENT);
          });
      }, 30000);

      it("should be able to create a new exist document image front", async () => {
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

        await request(app)
          .post(paths.v1.users_clients_documents_image)
          .set({
            Authorization: `Bearer ${token}`,
          })
          .attach("document", path_file)
          .field("description", USER_DOCUMENT_VALUE_ENUM.FRONT)
          .then((res) => {
            ("");
          });

        await request(app)
          .post(paths.v1.users_clients_documents_image)
          .set({
            Authorization: `Bearer ${token}`,
          })
          .attach("document", path_file)
          .field("description", USER_DOCUMENT_VALUE_ENUM.FRONT)
          .then((res) => {
            expect(res.status).toBe(HTTP_STATUS_CODE_SUCCESS_ENUM.NO_CONTENT);
          });
      }, 30000);

      it("should throw error to create a document front without token", async () => {
        // arrange
        // act
        const response = await request(app).post(
          paths.v1.users_clients_documents_image
        );

        expect(response.status).toBe(HTTP_ERROR_CODES_ENUM.UNAUTHORIZED);
        expect(response.body.message).toBe(
          UNAUTHORIZED.TOKEN_IS_MISSING.message
        );
      }, 30000);

      it("should throw error to create a document front with invalid token", async () => {
        // arrange
        // act
        const response = await request(app)
          .post(paths.v1.users_clients_documents_image)
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
          .post(paths.v1.users_clients_documents_image)
          .set({
            Authorization: `Bearer ${token}`,
          });

        expect(response.status).toBe(HTTP_ERROR_CODES_ENUM.FORBIDDEN);
        expect(response.body.message).toBe(
          FORBIDDEN.USER_IS_NOT_ACTIVE.message
        );
      }, 30000);
    });
  });
});
