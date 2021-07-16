import request from "supertest";
import { Connection, createConnections } from "typeorm";

import { orm_test } from "@root/ormconfig.test";
import {
  CONFLICT,
  FORBIDDEN,
  NOT_FOUND,
  UNAUTHORIZED,
} from "@shared/errors/constants";
import { HTTP_ERROR_CODES_ENUM } from "@shared/errors/enums";
import { app } from "@shared/infra/http/app";
import { HTTP_STATUS_CODE_SUCCESS_ENUM } from "@shared/infra/http/enums/HttpSuccessCode.enum";
import {
  AddressesFactory,
  PhonesFactory,
  UsersFactory,
  ImagesFactory,
  TagsFactory,
} from "@shared/infra/typeorm/factories";

let connection: Connection;
let seed: Connection;
describe("Client routes", () => {
  const usersFactory = new UsersFactory();
  const addressesFactory = new AddressesFactory();
  const phonesFactory = new PhonesFactory();
  const imagesFactory = new ImagesFactory();
  const tagsFactory = new TagsFactory();

  const paths = {
    v1: {
      users_clients: "/v1/users/clients",
      users_sessions: "/v1/users/sessions",
      users_clients_active: "/v1/users/clients/active",
      users_clients_addresses: "/v1/users/clients/addresses",
      users_clients_phones: "/v1/users/clients/phones",
      users_clients_tags: "/v1/users/clients/tags",
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
  describe("Post", () => {
    describe("Create Client - /", () => {
      it("should be able to create a new user", async () => {
        // arrange
        const [
          { name, last_name, cpf, rg, email, gender },
        ] = usersFactory.generate({
          quantity: 1,
        });

        // act
        const response = await request(app)
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

        expect(response.status).toBe(HTTP_STATUS_CODE_SUCCESS_ENUM.OK);
        expect(response.body).toEqual(
          expect.objectContaining({
            id: expect.any(String) && response.body.id,
            name: expect.any(String) && name,
            last_name: expect.any(String) && last_name,
            cpf: expect.any(String) && cpf,
            rg: expect.any(String) && rg,
            gender: expect.any(String) && gender,
            email: expect.any(String) && email,
            active: expect.any(Boolean) && false,
          })
        );
      }, 30000);

      it("should be return error to try create a new user minor age", async () => {
        // arrange
        const [
          { name, last_name, cpf, rg, email, gender },
        ] = usersFactory.generate({
          quantity: 1,
        });

        // act
        const response = await request(app).post(paths.v1.users_clients).send({
          name,
          last_name,
          cpf,
          gender,
          rg,
          email,
          password: "102030",
          password_confirm: "102030",
          birth_date: new Date(),
        });

        expect(response.status).toBe(HTTP_ERROR_CODES_ENUM.BAD_REQUEST);
      }, 30000);

      it("should be able to create a new user already exist", async () => {
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
            gender,
            email,
            password: "102030",
            password_confirm: "102030",
            birth_date: new Date(1995, 11, 17),
          });

        const response = await request(app)
          .post(paths.v1.users_clients)
          .send({
            name,
            last_name,
            cpf,
            rg,
            email,
            gender,
            password: "102030",
            password_confirm: "102030",
            birth_date: new Date(1995, 11, 17),
          });

        expect(response.status).toBe(HTTP_ERROR_CODES_ENUM.CONFLICT);
        expect(response.body.message).toBe(
          CONFLICT.USER_CLIENT_ALREADY_EXIST.message
        );
      }, 30000);
    });
  });

  describe("Patch", () => {
    describe("Create address for client /addresses", () => {
      it("should be able to create a address", async () => {
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

        const [
          {
            latitude,
            city,
            country,
            district,
            longitude,
            number,
            state,
            street,
            zipcode,
          },
        ] = addressesFactory.generate({
          quantity: 1,
        });

        const response = await request(app)
          .patch(paths.v1.users_clients_addresses)
          .set({
            Authorization: `Bearer ${token}`,
          })
          .send({
            latitude,
            city,
            country,
            district,
            longitude,
            number,
            state,
            street,
            zipcode,
          });

        expect(response.status).toBe(HTTP_STATUS_CODE_SUCCESS_ENUM.OK);
        expect(response.body).toEqual(
          expect.objectContaining({
            id: expect.any(String) && response.body.id,
            name: expect.any(String) && name,
            last_name: expect.any(String) && last_name,
            cpf: expect.any(String) && cpf,
            rg: expect.any(String) && rg,
            email: expect.any(String) && email,
            active: expect.any(Boolean) && true,
            gender: expect.any(String) && gender,
            phones: expect.arrayContaining([]),
            term: expect.arrayContaining([]),
            types: expect.arrayContaining([
              expect.objectContaining({
                name: expect.any(String),
                id: expect.any(String),
              }),
            ]),
            addresses: expect.arrayContaining([
              expect.objectContaining({
                street: expect.any(String) && street,
                number: expect.any(String) && number,
                zipcode: expect.any(String) && zipcode,
                district: expect.any(String) && district,
                city: expect.any(String) && city,
                state: expect.any(String) && state,
                country: expect.any(String) && country,
                id: expect.any(String) && response.body.addresses[0].id,
              }),
            ]),
          })
        );
      }, 30000);

      it("should throw error to create a new address without token", async () => {
        // arrange
        // act
        const response = await request(app).patch(
          paths.v1.users_clients_addresses
        );

        expect(response.status).toBe(HTTP_ERROR_CODES_ENUM.UNAUTHORIZED);
        expect(response.body.message).toBe(
          UNAUTHORIZED.TOKEN_IS_MISSING.message
        );
      }, 30000);

      it("should throw error to create a new address with invalid token", async () => {
        // arrange
        // act
        const response = await request(app)
          .patch(paths.v1.users_clients_addresses)
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
          .patch(paths.v1.users_clients_addresses)
          .set({
            Authorization: `Bearer ${token}`,
          });

        expect(response.status).toBe(HTTP_ERROR_CODES_ENUM.FORBIDDEN);
        expect(response.body.message).toBe(
          FORBIDDEN.USER_IS_NOT_ACTIVE.message
        );
      }, 30000);

      it("should be able to create a address if user not exist", async () => {
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

        const [
          {
            latitude,
            city,
            country,
            district,
            longitude,
            number,
            state,
            street,
            zipcode,
          },
        ] = addressesFactory.generate({
          quantity: 1,
        });

        const response = await request(app)
          .patch(paths.v1.users_clients_addresses)
          .set({
            Authorization: `Bearer ${token}`,
          })
          .send({
            latitude,
            city,
            country,
            district,
            longitude,
            number,
            state,
            street,
            zipcode,
          });

        expect(response.status).toBe(HTTP_ERROR_CODES_ENUM.NOT_FOUND);
        expect(response.body.message).toEqual(
          NOT_FOUND.USER_DOES_NOT_EXIST.message
        );
      }, 30000);
    });

    describe("Create phones for client /phones", () => {
      it("should be able to create a phone", async () => {
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

        const response = await request(app)
          .patch(paths.v1.users_clients_phones)
          .set({
            Authorization: `Bearer ${token}`,
          })
          .send({
            country_code,
            ddd,
            number,
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
              phones: expect.arrayContaining([
                expect.objectContaining({
                  ddd: expect.any(String) && ddd,
                  number: expect.any(String) && number,
                  country_code: expect.any(String) && country_code,
                }),
              ]),
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
          })
        );
      }, 30000);

      it("should throw error to create a new phone without token", async () => {
        // arrange
        // act
        const response = await request(app).patch(
          paths.v1.users_clients_phones
        );

        expect(response.status).toBe(HTTP_ERROR_CODES_ENUM.UNAUTHORIZED);
        expect(response.body.message).toBe(
          UNAUTHORIZED.TOKEN_IS_MISSING.message
        );
      }, 30000);

      it("should throw error to create a new phone number with invalid token", async () => {
        // arrange
        // act
        const response = await request(app)
          .patch(paths.v1.users_clients_phones)
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
          .patch(paths.v1.users_clients_phones)
          .set({
            Authorization: `Bearer ${token}`,
          });

        expect(response.status).toBe(HTTP_ERROR_CODES_ENUM.FORBIDDEN);
        expect(response.body.message).toBe(
          FORBIDDEN.USER_IS_NOT_ACTIVE.message
        );
      }, 30000);

      it("should be able to create a phone already exist exist", async () => {
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

        await request(app)
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
          .patch(paths.v1.users_clients_phones)
          .set({
            Authorization: `Bearer ${token}`,
          })
          .send({
            country_code,
            ddd,
            number,
          });
        expect(response.status).toBe(HTTP_ERROR_CODES_ENUM.FORBIDDEN);
        expect(response.body.message).toEqual(
          FORBIDDEN.PHONE_BELONGS_TO_ANOTHER_USER.message
        );
      }, 30000);
    });

    describe("Create tags for client /tags", () => {
      it("should be able to create a tags for user", async () => {
        // arrange
        const [
          { name, last_name, cpf, rg, email, gender },
        ] = usersFactory.generate({
          quantity: 1,
        });
        const [image_factory] = imagesFactory.generate({ quantity: 1 });
        const [tag_factory] = tagsFactory.generate({ quantity: 1 });
        const image = await connection
          .getRepository("images")
          .save(image_factory);

        const tag = await connection
          .getRepository("tags")
          .save({ ...tag_factory, image_id: image.id });

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
          .patch(paths.v1.users_clients_tags)
          .set({
            Authorization: `Bearer ${token}`,
          })
          .send({
            tags: [tag],
          });

        expect(response.status).toBe(HTTP_STATUS_CODE_SUCCESS_ENUM.NO_CONTENT);
      }, 30000);

      it("should throw error to create a new tags without token", async () => {
        // arrange
        // act
        const response = await request(app).patch(paths.v1.users_clients_tags);

        expect(response.status).toBe(HTTP_ERROR_CODES_ENUM.UNAUTHORIZED);
        expect(response.body.message).toBe(
          UNAUTHORIZED.TOKEN_IS_MISSING.message
        );
      }, 30000);

      it("should throw error to create a new tags with invalid token", async () => {
        // arrange
        // act
        const response = await request(app)
          .patch(paths.v1.users_clients_tags)
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
          .patch(paths.v1.users_clients_tags)
          .set({
            Authorization: `Bearer ${token}`,
          });

        expect(response.status).toBe(HTTP_ERROR_CODES_ENUM.FORBIDDEN);
        expect(response.body.message).toBe(
          FORBIDDEN.USER_IS_NOT_ACTIVE.message
        );
      }, 30000);

      it("should be able to create a user not already exist exist", async () => {
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

        const [{ country_code, ddd, number }] = phonesFactory.generate({
          quantity: 1,
        });

        await request(app)
          .patch(paths.v1.users_clients_phones)
          .set({
            Authorization: `Bearer ${token}`,
          })
          .send({
            country_code,
            ddd,
            number,
          });

        const tags = tagsFactory.generate({ quantity: 1, id: "true" });

        await connection
          .getRepository("users_types_users")
          .createQueryBuilder()
          .delete()
          .from("users_types_users")
          .where("user_id = :id", { id: user.id })
          .execute();

        await connection.getRepository("users").delete(user.id);

        const response = await request(app)
          .patch(paths.v1.users_clients_tags)
          .set({
            Authorization: `Bearer ${token}`,
          })
          .send({
            tags,
          });

        expect(response.status).toBe(HTTP_ERROR_CODES_ENUM.NOT_FOUND);
        expect(response.body.message).toEqual(
          NOT_FOUND.USER_DOES_NOT_EXIST.message
        );
      }, 30000);
    });

    describe("Create tags for client /tags", () => {
      it("should be able to create a tags for user", async () => {
        // arrange
        const [
          { name, last_name, cpf, rg, email, gender },
        ] = usersFactory.generate({
          quantity: 1,
        });
        const [image_factory] = imagesFactory.generate({ quantity: 1 });
        const [tag_factory] = tagsFactory.generate({ quantity: 1 });
        const image = await connection
          .getRepository("images")
          .save(image_factory);

        const tag = await connection
          .getRepository("tags")
          .save({ ...tag_factory, image_id: image.id });

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
          .patch(paths.v1.users_clients_tags)
          .set({
            Authorization: `Bearer ${token}`,
          })
          .send({
            tags: [tag],
          });

        expect(response.status).toBe(HTTP_STATUS_CODE_SUCCESS_ENUM.NO_CONTENT);
      }, 30000);

      it("should throw error to create a new tags without token", async () => {
        // arrange
        // act
        const response = await request(app).patch(paths.v1.users_clients_tags);

        expect(response.status).toBe(HTTP_ERROR_CODES_ENUM.UNAUTHORIZED);
        expect(response.body.message).toBe(
          UNAUTHORIZED.TOKEN_IS_MISSING.message
        );
      }, 30000);

      it("should throw error to create a new tags with invalid token", async () => {
        // arrange
        // act
        const response = await request(app)
          .patch(paths.v1.users_clients_tags)
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
          .patch(paths.v1.users_clients_tags)
          .set({
            Authorization: `Bearer ${token}`,
          });

        expect(response.status).toBe(HTTP_ERROR_CODES_ENUM.FORBIDDEN);
        expect(response.body.message).toBe(
          FORBIDDEN.USER_IS_NOT_ACTIVE.message
        );
      }, 30000);

      it("should be able to create a user not already exist exist", async () => {
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

        const [{ country_code, ddd, number }] = phonesFactory.generate({
          quantity: 1,
        });

        await request(app)
          .patch(paths.v1.users_clients_phones)
          .set({
            Authorization: `Bearer ${token}`,
          })
          .send({
            country_code,
            ddd,
            number,
          });

        const tags = tagsFactory.generate({ quantity: 1, id: "true" });

        await connection
          .getRepository("users_types_users")
          .createQueryBuilder()
          .delete()
          .from("users_types_users")
          .where("user_id = :id", { id: user.id })
          .execute();

        await connection.getRepository("users").delete(user.id);

        const response = await request(app)
          .patch(paths.v1.users_clients_tags)
          .set({
            Authorization: `Bearer ${token}`,
          })
          .send({
            tags,
          });

        expect(response.status).toBe(HTTP_ERROR_CODES_ENUM.NOT_FOUND);
        expect(response.body.message).toEqual(
          NOT_FOUND.USER_DOES_NOT_EXIST.message
        );
      }, 30000);
    });

    describe("Active user for client /active", () => {
      it("should be able to active a user client for user", async () => {
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

        const response = await request(app)
          .patch(paths.v1.users_clients_active)
          .set({
            Authorization: `Bearer ${token_admin}`,
          })
          .send({
            cpf,
          });

        expect(response.status).toBe(HTTP_STATUS_CODE_SUCCESS_ENUM.NO_CONTENT);
      }, 30000);

      it("should throw error to active an new user client without token", async () => {
        // arrange
        // act
        const response = await request(app).patch(
          paths.v1.users_clients_active
        );

        expect(response.status).toBe(HTTP_ERROR_CODES_ENUM.UNAUTHORIZED);
        expect(response.body.message).toBe(
          UNAUTHORIZED.TOKEN_IS_MISSING.message
        );
      }, 30000);

      it("should throw error to active an new user client with invalid token", async () => {
        // arrange
        // act
        const response = await request(app)
          .patch(paths.v1.users_clients_active)
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
          .patch(paths.v1.users_clients_active)
          .set({
            Authorization: `Bearer ${token}`,
          });

        expect(response.status).toBe(HTTP_ERROR_CODES_ENUM.FORBIDDEN);
        expect(response.body.message).toBe(
          FORBIDDEN.USER_IS_NOT_ACTIVE.message
        );
      }, 30000);

      it("should be throw error if user is type diff ADMIN or INSIDE active", async () => {
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
          .patch(paths.v1.users_clients_active)
          .set({
            Authorization: `Bearer ${token}`,
          });

        expect(response.status).toBe(HTTP_ERROR_CODES_ENUM.FORBIDDEN);
        expect(response.body.message).toBe(
          FORBIDDEN.INSIDE_IS_NOT_ACTIVE.message
        );
      }, 30000);

      it("should be able active an new user client not exist exist", async () => {
        // arrange
        const [{ cpf }] = usersFactory.generate({
          quantity: 1,
        });

        // act
        const {
          body: { token: token_admin },
        } = await request(app).post(paths.v1.users_sessions).send({
          email: "admin@cherry-go.love",
          password: "102030",
        });

        const response = await request(app)
          .patch(paths.v1.users_clients_active)
          .set({
            Authorization: `Bearer ${token_admin}`,
          })
          .send({
            cpf,
          });

        expect(response.status).toBe(HTTP_ERROR_CODES_ENUM.NOT_FOUND);
        expect(response.body.message).toEqual(
          NOT_FOUND.USER_DOES_NOT_EXIST.message
        );
      }, 30000);
    });
  });
});
