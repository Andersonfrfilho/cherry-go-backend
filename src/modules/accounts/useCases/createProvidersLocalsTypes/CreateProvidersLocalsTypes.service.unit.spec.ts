import "reflect-metadata";

import { providersRepositoryMock } from "@modules/accounts/repositories/mocks/Providers.repository.mock";
import { usersRepositoryMock } from "@modules/accounts/repositories/mocks/Users.repository.mock";
import { CreateProvidersPaymentsTypesService } from "@modules/accounts/useCases/createProvidersPaymentsTypes/CreateProvidersPaymentsTypes.service";
import { TermsAcceptUserService } from "@modules/accounts/useCases/termsAcceptsUser/TermsAcceptsUser.service";
import { PAYMENT_TYPES_ENUM } from "@modules/transactions/enums/PaymentTypes.enum";
import { AppError } from "@shared/errors/AppError";
import { NOT_FOUND } from "@shared/errors/constants";
import {
  AddressesFactory,
  ImagesFactory,
  PhonesFactory,
  UsersFactory,
  UsersTypesFactory,
  UsersTermsFactory,
  PaymentsTypesFactory,
} from "@shared/infra/typeorm/factories";

let createProvidersPaymentsTypesService: CreateProvidersPaymentsTypesService;
const mockedDate = new Date("2020-09-01T09:33:37");

jest.mock("uuid");
jest.useFakeTimers("modern").setSystemTime(mockedDate.getTime());
const { CARD_CREDIT, CARD_DEBIT, MONEY, PIX } = PAYMENT_TYPES_ENUM;
describe("CreateProvidersPaymentsTypesService", () => {
  const usersFactory = new UsersFactory();
  const usersTypesFactory = new UsersTypesFactory();
  const addressesFactory = new AddressesFactory();
  const phonesFactory = new PhonesFactory();
  const imageProfileFactory = new ImagesFactory();
  const usersTermsFactory = new UsersTermsFactory();
  const paymentTypesFactory = new PaymentsTypesFactory();

  beforeEach(() => {
    createProvidersPaymentsTypesService = new CreateProvidersPaymentsTypesService(
      providersRepositoryMock
    );
  });

  it("Should be able to create payment types user", async () => {
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
    const payments_types = paymentTypesFactory.generate({});
    providersRepositoryMock.findById.mockResolvedValue({
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
    providersRepositoryMock.createPaymentTypesAvailable.mockResolvedValue({});

    // act
    await createProvidersPaymentsTypesService.execute({
      payments_types: [CARD_CREDIT, CARD_DEBIT, MONEY, PIX],
      provider_id: id,
    });

    // assert
    expect(providersRepositoryMock.findById).toHaveBeenCalledWith(id);
    expect(
      providersRepositoryMock.createPaymentTypesAvailable
    ).toHaveBeenCalledWith({
      payments_types: [CARD_CREDIT, CARD_DEBIT, MONEY, PIX],
      provider_id: id,
    });
  });

  it("Not should able to create payment types not exist", async () => {
    // arrange
    const [{ id }] = usersFactory.generate({
      quantity: 1,
      id: "true",
    });
    providersRepositoryMock.findById.mockResolvedValue(undefined);

    // act
    // assert
    expect.assertions(2);
    await expect(
      createProvidersPaymentsTypesService.execute({
        payments_types: [CARD_CREDIT, CARD_DEBIT, MONEY, PIX],
        provider_id: id,
      })
    ).rejects.toEqual(new AppError(NOT_FOUND.PROVIDER_DOES_NOT_EXIST));

    expect(providersRepositoryMock.findById).toHaveBeenCalledWith(id);
  });
});
