import "reflect-metadata";
import { faker } from "@faker-js/faker/locale/pt_BR"

import auth from "@config/auth";
import { providersRepositoryMock } from "@modules/accounts/repositories/mocks/Providers.repository.mock";
import { usersTokensRepositoryMock } from "@modules/accounts/repositories/mocks/UsersTokens.repository.mock";
import { AuthenticateUserProviderService } from "@modules/accounts/useCases/authenticateUserProvider/AuthenticateUserProvider.service";
import { dateProviderMock } from "@shared/container/providers/DateProvider/mocks/Date.provider.mock";
import { hashProviderMock } from "@shared/container/providers/HashProvider/mocks/Hash.provider.mock";
import { jwtProviderMock } from "@shared/container/providers/JwtProvider/mocks/Jwt.provider.mock";
import { AppError } from "@shared/errors/AppError";
import { FORBIDDEN, NOT_FOUND, UNAUTHORIZED } from "@shared/errors/constants";
import {
  AddressesFactory,
  ImagesFactory,
  PhonesFactory,
  UsersFactory,
  UsersTypesFactory,
  UsersTermsFactory,
} from "@shared/infra/typeorm/factories";

let authenticateUserProviderService: AuthenticateUserProviderService;

const mockedDate = new Date("2020-09-01T09:33:37");

jest.mock("uuid");
jest.useFakeTimers("modern").setSystemTime(mockedDate.getTime());

describe("AuthenticateUserProviderService", () => {
  const usersFactory = new UsersFactory();
  const usersTypesFactory = new UsersTypesFactory();
  const addressesFactory = new AddressesFactory();
  const phonesFactory = new PhonesFactory();
  const imageProfileFactory = new ImagesFactory();
  const usersTermsFactory = new UsersTermsFactory();

  beforeEach(() => {
    authenticateUserProviderService = new AuthenticateUserProviderService(
      providersRepositoryMock,
      usersTokensRepositoryMock,
      hashProviderMock,
      dateProviderMock,
      jwtProviderMock
    );
  });

  it("Should be able to authenticated user type provider", async () => {
    // arrange
    const { expires_in, secret } = auth;
    const [
      {
        name,
        last_name,
        cpf,
        rg,
        email,
        birth_date,
        password_hash,
        id,
        active,
      },
    ] = usersFactory.generate({ quantity: 1, id: "true", active: true });
    const [type] = usersTypesFactory.generate({});
    const [phone] = phonesFactory.generate({ quantity: 1, id: "true" });
    const [address] = addressesFactory.generate({ quantity: 1, id: "true" });
    const [image_profile] = imageProfileFactory.generate({
      quantity: 1,
      id: "true",
    });
    const [term] = usersTermsFactory.generate({ quantity: 1, accept: true });
    const token_faker = faker.datatype.uuid();
    const refresh_token_faker = faker.datatype.uuid();

    providersRepositoryMock.findByEmail.mockResolvedValue({
      id,
      name,
      last_name,
      cpf,
      rg,
      email,
      birth_date,
      password_hash,
      active,
      phones: [phone],
      addresses: [address],
      types: [type],
      image_profile: [{ image: image_profile }],
      term: [term],
    });
    hashProviderMock.compareHash.mockResolvedValue(true);
    jwtProviderMock.assign
      .mockReturnValueOnce(token_faker)
      .mockReturnValueOnce(refresh_token_faker);
    dateProviderMock.addDays.mockReturnValue(expires_in.refresh_days);
    usersTokensRepositoryMock.create.mockResolvedValue({});

    // act
    const result = await authenticateUserProviderService.execute({
      email,
      password: password_hash,
    });

    // assert
    // expect.assertions(7);
    expect(providersRepositoryMock.findByEmail).toHaveBeenCalledWith(email);
    expect(hashProviderMock.compareHash).toHaveBeenCalledWith(
      password_hash,
      password_hash
    );

    expect(jwtProviderMock.assign).toHaveBeenNthCalledWith(1, {
      payload: {},
      secretOrPrivateKey: secret.token,
      options: {
        subject: {
          user: {
            id,
            active,
            types: [type],
          },
        },
        expiresIn: expires_in.token,
      },
    });

    expect(jwtProviderMock.assign).toHaveBeenNthCalledWith(2, {
      payload: { email },
      secretOrPrivateKey: secret.refresh,
      options: {
        subject: {
          user: {
            id,
            active,
            types: [type],
          },
        },
        expiresIn: expires_in.refresh,
      },
    });
    expect(dateProviderMock.addDays).toHaveBeenCalledWith(
      expires_in.refresh_days
    );
    expect(usersTokensRepositoryMock.create).toHaveBeenCalledWith({
      user_id: id,
      expires_date: expires_in.refresh_days,
      refresh_token: refresh_token_faker,
    });

    expect(result).toEqual(
      expect.objectContaining({
        user: expect.objectContaining({
          id: expect.any(String) && id,
          name: expect.any(String) && name,
          last_name: expect.any(String) && last_name,
          cpf: expect.any(String) && cpf,
          rg: expect.any(String) && rg,
          email: expect.any(String) && email,
          password_hash: expect.any(String) && password_hash,
          birth_date: expect.any(Date) && birth_date,
          active: expect.any(Boolean) && active,
          types: expect.arrayContaining([
            expect.objectContaining({
              id: expect.any(String) && type.id,
              name: expect.any(String) && type.name,
              description: expect.any(String || null) && type.description,
            }),
          ]),
          phones: expect.arrayContaining([
            expect.objectContaining({
              id: expect.any(String) && phone.id,
              country_code: expect.any(String) && phone.country_code,
              ddd: expect.any(String) && phone.ddd,
              number: expect.any(String) && phone.number,
            }),
          ]),
          addresses: expect.arrayContaining([
            expect.objectContaining({
              id: expect.any(String) && address.id,
              city: expect.any(String) && address.city,
              country: expect.any(String) && address.country,
              district: expect.any(String) && address.district,
              number: expect.any(String) && address.number,
              state: expect.any(String) && address.state,
              street: expect.any(String) && address.street,
              zipcode: expect.any(String) && address.zipcode,
            }),
          ]),
          image_profile: expect.arrayContaining([
            expect.objectContaining({
              image: expect.objectContaining({
                id: expect.any(String) && image_profile.id,
                name: expect.any(String) && image_profile.name,
              }),
            }),
          ]),
          term: expect.arrayContaining([
            expect.objectContaining({
              id: expect.any(String) && term.id,
              accept: expect.any(Boolean) && term.accept,
            }),
          ]),
        }),
        token: expect.any(String) && token_faker,
        refresh_token: expect.any(String) && refresh_token_faker,
      })
    );
  });

  it("Not should able to authenticated user type provider not exist", async () => {
    // arrange
    const [{ email, password_hash }] = usersFactory.generate({
      quantity: 1,
      id: "true",
    });

    providersRepositoryMock.findByEmail.mockResolvedValue(undefined);

    // act
    // assert
    expect.assertions(2);
    await expect(
      authenticateUserProviderService.execute({
        email,
        password: password_hash,
      })
    ).rejects.toEqual(new AppError(NOT_FOUND.PROVIDER_DOES_NOT_EXIST));

    expect(providersRepositoryMock.findByEmail).toHaveBeenCalledWith(email);
  });

  it("Should not be password match in user provider authenticated", async () => {
    // arrange
    const [
      {
        name,
        last_name,
        cpf,
        rg,
        email,
        birth_date,
        password_hash,
        id,
        active,
      },
    ] = usersFactory.generate({ quantity: 1, id: "true", active: true });
    const [type] = usersTypesFactory.generate({});
    const [phone] = phonesFactory.generate({ quantity: 1, id: "true" });
    const [address] = addressesFactory.generate({ quantity: 1, id: "true" });
    const [image_profile] = imageProfileFactory.generate({
      quantity: 1,
      id: "true",
    });
    const [term] = usersTermsFactory.generate({ quantity: 1, accept: true });

    providersRepositoryMock.findByEmail.mockResolvedValue({
      id,
      name,
      last_name,
      cpf,
      rg,
      email,
      birth_date,
      password_hash,
      active,
      phones: [phone],
      addresses: [address],
      types: [type],
      image_profile: [{ image: image_profile }],
      term: [term],
    });
    hashProviderMock.compareHash.mockResolvedValue(false);

    // act

    // assert
    expect.assertions(3);
    await expect(
      authenticateUserProviderService.execute({
        email,
        password: password_hash,
      })
    ).rejects.toEqual(new AppError(UNAUTHORIZED.USER_PASSWORD_DOES_MATCH));
    expect(providersRepositoryMock.findByEmail).toHaveBeenCalledWith(email);
    expect(hashProviderMock.compareHash).toHaveBeenCalledWith(
      password_hash,
      password_hash
    );
  });

  it("Should not be password match in user provider is not type provider authenticated", async () => {
    // arrange
    const [
      {
        name,
        last_name,
        cpf,
        rg,
        email,
        birth_date,
        password_hash,
        id,
        active,
      },
    ] = usersFactory.generate({ quantity: 1, id: "true", active: true });
    const [, type] = usersTypesFactory.generate({});
    const [phone] = phonesFactory.generate({ quantity: 1, id: "true" });
    const [address] = addressesFactory.generate({ quantity: 1, id: "true" });
    const [image_profile] = imageProfileFactory.generate({
      quantity: 1,
      id: "true",
    });
    const [term] = usersTermsFactory.generate({ quantity: 1, accept: true });

    providersRepositoryMock.findByEmail.mockResolvedValue({
      id,
      name,
      last_name,
      cpf,
      rg,
      email,
      birth_date,
      password_hash,
      active,
      phones: [phone],
      addresses: [address],
      types: [type],
      image_profile: [{ image: image_profile }],
      term: [term],
    });
    hashProviderMock.compareHash.mockResolvedValue(false);

    // act

    // assert
    expect.assertions(2);
    await expect(
      authenticateUserProviderService.execute({
        email,
        password: password_hash,
      })
    ).rejects.toEqual(new AppError(FORBIDDEN.PROVIDER_IS_NOT_ACTIVE));
    expect(providersRepositoryMock.findByEmail).toHaveBeenCalledWith(email);
  });
});
