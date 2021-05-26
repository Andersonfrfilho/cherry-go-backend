import { UsersRepositoryInMemory } from "@modules/accounts/repositories/in-memory/UserRepositoryInMemory";
import { UsersTokensRepositoryInMemory } from "@modules/accounts/repositories/in-memory/UsersTokensRepositoryInMemory";
import { IUsersRepository } from "@modules/accounts/repositories/IUsersRepository";
import { IUsersTokensRepository } from "@modules/accounts/repositories/IUsersTokensRepository";
import { AuthenticateUserService } from "@modules/accounts/useCases/authenticateUser/AuthenticateUser.service";
import { CreateUserClientService } from "@modules/accounts/useCases/createUserClient/CreateUserClient.service";
import { IDateProvider } from "@shared/container/providers/DateProvider/IDateProvider";
import { DateFnsProvider } from "@shared/container/providers/DateProvider/implementations/DateFnsProvider";
import { IHashProvider } from "@shared/container/providers/HashProvider/IHashProvider";
import { HashProviderInMemory } from "@shared/container/providers/HashProvider/in-memory/HashProviderInMemory";
import { HttpErrorCodes } from "@shared/enums/statusCode";
import { AppError } from "@shared/errors/AppError";
import { UsersFactory } from "@shared/infra/typeorm/factories";

import { ResetPasswordService } from "./ResetPasswordUser.service";

let authenticateUserService: AuthenticateUserService;
let usersRepositoryInMemory: IUsersRepository;
let usersTokensRepositoryInMemory: IUsersTokensRepository;
let createUserService: CreateUserClientService;
let hashProviderInMemory: IHashProvider;
let dateProvider: IDateProvider;
let resetPasswordService: ResetPasswordService;

describe("Reset Password user service", () => {
  const usersFactory = new UsersFactory();

  beforeEach(() => {
    usersRepositoryInMemory = new UsersRepositoryInMemory();
    hashProviderInMemory = new HashProviderInMemory();
    dateProvider = new DateFnsProvider();
    createUserService = new CreateUserClientService(
      usersRepositoryInMemory,
      hashProviderInMemory
    );
    usersTokensRepositoryInMemory = new UsersTokensRepositoryInMemory();
    authenticateUserService = new AuthenticateUserService(
      usersRepositoryInMemory,
      usersTokensRepositoryInMemory,
      hashProviderInMemory,
      dateProvider
    );
    resetPasswordService = new ResetPasswordService(
      usersTokensRepositoryInMemory,
      dateProvider,
      usersRepositoryInMemory,
      hashProviderInMemory
    );
  });

  it("should be able to reset password an user", async () => {
    const usersTokensRepositoryFindByRefreshToken = jest.spyOn(
      usersTokensRepositoryInMemory,
      "findByRefreshToken"
    );
    const dateProviderCompareIfBefore = jest.spyOn(
      dateProvider,
      "compareIfBefore"
    );
    const hashProviderGenerateHash = jest.spyOn(
      hashProviderInMemory,
      "generateHash"
    );
    const usersRepositoryUpdatePasswordUser = jest.spyOn(
      usersRepositoryInMemory,
      "updatePasswordUser"
    );
    const usersTokensRepositoryDeleteById = jest.spyOn(
      usersRepositoryInMemory,
      "updatePasswordUser"
    );
    // jest
    //   .spyOn<any, any>(usersTokensRepositoryInMemory, "findByRefreshToken")
    //   .mockImplementation(() => {
    //     return "token_valid";
    //   });

    // jest
    //   .spyOn<any, any>(dateProvider, "compareIfBefore")
    //   .mockImplementation(() => {
    //     return false;
    //   });

    // jest
    //   .spyOn<any, any>(hashProviderInMemory, "generateHash")
    //   .mockImplementation(() => {
    //     return "password_hash";
    //   });

    // jest
    //   .spyOn<any, any>(usersRepositoryInMemory, "updatePasswordUser")
    //   .mockImplementation();

    // const data = jest
    //   .spyOn<any, any>(usersTokensRepositoryInMemory, "deleteById")
    //   .mockImplementation();

    const [
      { name, last_name, cpf, rg, email, birth_date, password_hash },
    ] = usersFactory.generate({
      quantity: 1,
      active: true,
    });

    await createUserService.execute({
      name,
      last_name,
      cpf,
      rg,
      email,
      birth_date,
      password: password_hash,
    });

    const { refresh_token } = await authenticateUserService.execute({
      email,
      password: password_hash,
    });

    await resetPasswordService.execute({
      token: refresh_token,
      password: "102030",
    });
    expect(usersTokensRepositoryFindByRefreshToken).toHaveBeenCalled();
    expect(dateProviderCompareIfBefore).toHaveBeenCalled();
    expect(hashProviderGenerateHash).toHaveBeenCalled();
    expect(usersRepositoryUpdatePasswordUser).toHaveBeenCalled();
    expect(usersTokensRepositoryDeleteById).toHaveBeenCalled();
  });

  it("should not be able to reset password if token invalid", async () => {
    const usersTokensRepositoryFindByRefreshToken = jest.spyOn(
      usersTokensRepositoryInMemory,
      "findByRefreshToken"
    );

    const [
      { name, last_name, cpf, rg, email, birth_date, password_hash },
    ] = usersFactory.generate({
      quantity: 1,
      active: true,
    });

    await createUserService.execute({
      name,
      last_name,
      cpf,
      rg,
      email,
      birth_date,
      password: password_hash,
    });

    const { token } = await authenticateUserService.execute({
      email,
      password: password_hash,
    });

    await expect(
      resetPasswordService.execute({
        token,
        password: "102030",
      })
    ).rejects.toEqual(
      new AppError({
        message: "Token invalid!",
        status_code: HttpErrorCodes.BAD_REQUEST,
      })
    );
    expect(usersTokensRepositoryFindByRefreshToken).toHaveBeenCalled();
  });

  it("should not be able to reset password if token invalid", async () => {
    const usersTokensRepositoryFindByRefreshToken = jest.spyOn(
      usersTokensRepositoryInMemory,
      "findByRefreshToken"
    );
    const dateProviderCompareIfBefore = jest
      .spyOn(dateProvider, "compareIfBefore")
      .mockImplementation(() => {
        return true;
      });

    const [
      { name, last_name, cpf, rg, email, birth_date, password_hash },
    ] = usersFactory.generate({
      quantity: 1,
      active: true,
    });
    await createUserService.execute({
      name,
      last_name,
      cpf,
      rg,
      email,
      birth_date,
      password: password_hash,
    });

    const { refresh_token } = await authenticateUserService.execute({
      email,
      password: password_hash,
    });

    await expect(
      resetPasswordService.execute({
        token: refresh_token,
        password: "102030",
      })
    ).rejects.toEqual(
      new AppError({
        message: "Token expired!",
        status_code: HttpErrorCodes.UNAUTHORIZED,
      })
    );

    expect(usersTokensRepositoryFindByRefreshToken).toHaveBeenCalled();
    expect(dateProviderCompareIfBefore).toHaveBeenCalled();
  });
});
