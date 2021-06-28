import "reflect-metadata";
import faker from "faker";
import * as uuid from "uuid";

import { config } from "@config/environment";
import { usersRepositoryMock } from "@modules/accounts/repositories/mocks/UsersRepository.mock";
import { usersTokensRepositoryMock } from "@modules/accounts/repositories/mocks/UsersTokensRepository.mock";
import { SendForgotPasswordMailService } from "@modules/accounts/useCases/sendForgotPasswordMail/SendForgotPasswordMail.service";
import { dateProviderMock } from "@shared/container/providers/DateProvider/mocks/DateProvider.mock";
import { ISendMailDTO } from "@shared/container/providers/MailProvider/dtos/ISendMailDTO";
import { MailContent } from "@shared/container/providers/MailProvider/enums/MailType.enum";
import { queueProviderMock } from "@shared/container/providers/QueueProvider/mocks/QueueProvider.mock";
import { TopicsQueueEnum } from "@shared/container/providers/QueueProvider/topics/sendEmail.topics";
import { AppError } from "@shared/errors/AppError";
import { NOT_FOUND } from "@shared/errors/constants";
import {
  AddressesFactory,
  PhonesFactory,
  UsersFactory,
  UsersTypesFactory,
} from "@shared/infra/typeorm/factories";

let sendForgotPasswordMailService: SendForgotPasswordMailService;
const mocked_date = new Date("2020-09-01T09:33:37");
jest.mock("uuid");
jest.useFakeTimers("modern").setSystemTime(mocked_date.getTime());

describe("SendForgotPasswordMailService", () => {
  const usersFactory = new UsersFactory();
  const usersTypesFactory = new UsersTypesFactory();
  const phonesFactory = new PhonesFactory();
  const addressesFactory = new AddressesFactory();

  beforeEach(() => {
    sendForgotPasswordMailService = new SendForgotPasswordMailService(
      usersRepositoryMock,
      usersTokensRepositoryMock,
      dateProviderMock,
      queueProviderMock
    );
  });

  it("Should be env email type forgot password mail", async () => {
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
        active,
        id,
      },
    ] = usersFactory.generate({ quantity: 1, active: false, id: "true" });
    const [type] = usersTypesFactory.generate("with_id");
    const [phone] = phonesFactory.generate({ quantity: 1, id: "true" });
    const [address] = addressesFactory.generate({ quantity: 1, id: "true" });
    const refresh_token_faker = faker.datatype.uuid();
    const variables = {
      name,
      link: `${process.env.FORGOT_MAIL_URL}${refresh_token_faker}`,
    };

    const message: ISendMailDTO = {
      to: email,
      email_type: MailContent.FORGOT_PASSWORD,
      variables,
    };
    const messages = [];

    messages.push({ value: JSON.stringify(message) });

    usersRepositoryMock.findByEmail.mockResolvedValue({
      name,
      last_name,
      cpf,
      rg,
      email,
      birth_date,
      password_hash,
      active,
      id,
      types: [type],
      phones: [phone],
      addresses: [address],
    });
    jest.spyOn(uuid, "v4").mockReturnValue(refresh_token_faker);
    dateProviderMock.addMinutes.mockReturnValue(mocked_date);
    usersTokensRepositoryMock.create.mockResolvedValue({});
    queueProviderMock.sendMessage.mockResolvedValue({});
    // act
    await sendForgotPasswordMailService.execute(email);

    // assert
    expect(usersRepositoryMock.findByEmail).toHaveBeenCalledWith(email);
    expect(dateProviderMock.addMinutes).toHaveBeenCalledWith(
      config.password.time_token_expires
    );
    expect(usersTokensRepositoryMock.create).toHaveBeenCalledWith({
      refresh_token: refresh_token_faker,
      user_id: id,
      expires_date: mocked_date,
    });
    expect(queueProviderMock.sendMessage).toHaveBeenCalledWith({
      topic: TopicsQueueEnum.SEND_MAIL,
      messages,
    });
  });

  it("Should not be send email forgot password if user not exist", async () => {
    // arrange
    const [{ email }] = usersFactory.generate({
      quantity: 1,
    });

    usersRepositoryMock.findByEmail.mockResolvedValue(undefined);
    // act
    // assert
    expect.assertions(2);
    await expect(sendForgotPasswordMailService.execute(email)).rejects.toEqual(
      new AppError(NOT_FOUND.USER_DOES_NOT_EXIST)
    );
    expect(usersRepositoryMock.findByEmail).toHaveBeenCalledWith(email);
  });
});
