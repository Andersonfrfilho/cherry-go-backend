import "reflect-metadata";
import faker from "faker";

import { usersRepositoryMock } from "@modules/accounts/repositories/mocks/UsersRepository.mock";
import { usersTokensRepositoryMock } from "@modules/accounts/repositories/mocks/UsersTokensRepository.mock";
import { dateProviderMock } from "@shared/container/providers/DateProvider/mocks/DateProvider.mock";
import { HttpErrorCodes } from "@shared/enums/statusCode";
import { AppError } from "@shared/errors/AppError";

import { ConfirmAccountMailUserService } from "./ConfirmAccountMailUser.service";

let confirmAccountMailUserService: ConfirmAccountMailUserService;
const mocked_date = new Date("2020-09-01T09:33:37");
jest.mock("uuid");
jest.useFakeTimers("modern").setSystemTime(mocked_date.getTime());

describe("ConfirmAccountMailUserService", () => {
  beforeEach(() => {
    confirmAccountMailUserService = new ConfirmAccountMailUserService(
      usersRepositoryMock,
      usersTokensRepositoryMock,
      dateProviderMock
    );
  });

  it("Should be confirm user, for status true", async () => {
    // arrange
    const user_id_faker = faker.datatype.uuid();
    const token_faker = faker.datatype.uuid();

    usersTokensRepositoryMock.findByRefreshToken.mockResolvedValue({
      expires_date: mocked_date,
      user_id: user_id_faker,
    });
    dateProviderMock.compareIfBefore.mockReturnValue(false);
    usersRepositoryMock.updateActiveUser.mockResolvedValue({});

    // act
    await confirmAccountMailUserService.execute(token_faker);

    // assert
    expect(usersTokensRepositoryMock.findByRefreshToken).toHaveBeenCalledWith(
      token_faker
    );
    expect(dateProviderMock.compareIfBefore).toHaveBeenCalledWith(
      mocked_date,
      mocked_date
    );
    expect(usersRepositoryMock.updateActiveUser).toHaveBeenCalledWith({
      id: user_id_faker,
      active: true,
    });
  });

  it("should not be able to confirm user mail, if token invalid", async () => {
    // arrange
    usersTokensRepositoryMock.findByRefreshToken.mockResolvedValue(undefined);
    const token_faker = faker.datatype.uuid();

    // act
    // assert
    expect.assertions(2);
    await expect(
      confirmAccountMailUserService.execute(token_faker)
    ).rejects.toEqual(new AppError({ message: "Token invalid!" }));

    expect(usersTokensRepositoryMock.findByRefreshToken).toHaveBeenCalledWith(
      token_faker
    );
  });

  it("should not be able to confirm user mail, if token expired", async () => {
    // arrange
    const user_id_faker = faker.datatype.uuid();
    const token_faker = faker.datatype.uuid();

    usersTokensRepositoryMock.findByRefreshToken.mockResolvedValue({
      expires_date: mocked_date,
      user_id: user_id_faker,
    });
    dateProviderMock.compareIfBefore.mockReturnValue(true);
    usersRepositoryMock.updateActiveUser.mockResolvedValue({});

    // act
    // assert
    expect.assertions(3);
    await expect(
      confirmAccountMailUserService.execute(token_faker)
    ).rejects.toEqual(
      new AppError({
        message: "Token expired!",
        status_code: HttpErrorCodes.UNAUTHORIZED,
      })
    );

    expect(usersTokensRepositoryMock.findByRefreshToken).toHaveBeenCalledWith(
      token_faker
    );
    expect(dateProviderMock.compareIfBefore).toHaveBeenCalledWith(
      mocked_date,
      mocked_date
    );
  });
});
