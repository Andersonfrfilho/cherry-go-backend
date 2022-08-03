import "reflect-metadata";
import { faker } from "@faker-js/faker/locale/pt_BR"

import { providersRepositoryMock } from "@modules/accounts/repositories/mocks/Providers.repository.mock";
import { servicesProvidersRepositoryMock } from "@modules/accounts/repositories/mocks/ServicesProviders.repository.mock";
import { usersRepositoryMock } from "@modules/accounts/repositories/mocks/Users.repository.mock";
import { addressesRepositoryMock } from "@modules/addresses/repositories/mocks/Address.repository.mock";
import { appointmentsRepositoryMock } from "@modules/appointments/repositories/mocks/Appointments.repository.mocks";
import { appointmentsAddressesRepositoryMock } from "@modules/appointments/repositories/mocks/AppointmentsAddresses.repository.mocks";
import { appointmentsProvidersRepositoryMock } from "@modules/appointments/repositories/mocks/AppointmentsProviders.repository.mocks";
import { appointmentsProvidersServicesRepositoryMock } from "@modules/appointments/repositories/mocks/AppointmentsProvidersServices.repository.mocks";
import { appointmentsUsersRepositoryMock } from "@modules/appointments/repositories/mocks/AppointmentsUsers.repository.mocks";
import { appointmentsUsersTransactionsRepositoryMock } from "@modules/appointments/repositories/mocks/AppointmentsUsersTransactions.repository.mocks";
import { appointmentsTransactionsItensRepositoryMock } from "@modules/appointments/repositories/mocks/AppointmentTransactionsItens.repository.mocks";
import { CreateAppointmentService } from "@modules/appointments/useCases/createAppointment/CreateAppointment.service";
import { transportsRepositoryMock } from "@modules/transports/repositories/mocks/Transports.repository.mock";
import { AppError } from "@shared/errors/AppError";
import { NOT_FOUND } from "@shared/errors/constants";
import {
  ImagesFactory,
  PhonesFactory,
  UsersFactory,
  UsersTypesFactory,
  UsersTermsFactory,
  AppointmentsFactory,
  ServicesFactory,
  AddressesFactory,
  TransactionsFactory,
} from "@shared/infra/typeorm/factories";

let createAppointmentService: CreateAppointmentService;
const mocked_date = new Date("2020-09-01T09:33:37");
jest.mock("uuid");
jest.useFakeTimers("modern").setSystemTime(mocked_date.getTime());

describe("CreateAppointmentService", () => {
  const usersFactory = new UsersFactory();
  const phonesFactory = new PhonesFactory();
  const addressesFactory = new AddressesFactory();
  const imagesFactory = new ImagesFactory();
  const usersTermsFactory = new UsersTermsFactory();
  const usersTypesFactory = new UsersTypesFactory();
  const appointmentsFactory = new AppointmentsFactory();
  const servicesFactory = new ServicesFactory();
  const transactionsFactory = new TransactionsFactory();

  beforeEach(() => {
    createAppointmentService = new CreateAppointmentService(
      usersRepositoryMock,
      addressesRepositoryMock,
      providersRepositoryMock,
      appointmentsRepositoryMock,
      appointmentsUsersRepositoryMock,
      appointmentsProvidersRepositoryMock,
      servicesProvidersRepositoryMock,
      appointmentsProvidersServicesRepositoryMock,
      appointmentsAddressesRepositoryMock,
      transportsRepositoryMock,
      appointmentsUsersTransactionsRepositoryMock,
      appointmentsTransactionsItensRepositoryMock
    );
  });

  it("Should be able to active an user", async () => {
    // arrange
    const [user, provider] = usersFactory.generate({
      quantity: 2,
      active: false,
      id: "true",
    });
    const phones = phonesFactory.generate({ quantity: 1, id: "true" });
    const [address] = addressesFactory.generate({ quantity: 1, id: "true" });
    const image_profile = imagesFactory.generate({ quantity: 1, id: "true" });
    const [type] = usersTypesFactory.generate({});
    const [term] = usersTermsFactory.generate({ quantity: 1, accept: false });
    const [service] = servicesFactory.generate({ quantity: 1, id: "true" });
    const [appointment] = appointmentsFactory.generate({
      quantity: 1,
      id: "true",
    });
    const [transaction] = transactionsFactory.generate({
      quantity: 1,
      id: "true",
    });
    appointmentsRepositoryMock.create.mockResolvedValue(appointment);
    addressesRepositoryMock.create.mockResolvedValue(address);
    appointmentsAddressesRepositoryMock.create.mockResolvedValue({
      appointment_id: appointment.id,
      addresses_id: address.id,
    });
    usersRepositoryMock.findByIdsActive.mockResolvedValue([user]);
    appointmentsUsersRepositoryMock.create.mockResolvedValue({});
    providersRepositoryMock.findByIdsActiveAndServices.mockResolvedValue([
      service,
    ]);
    appointmentsProvidersRepositoryMock.create.mockResolvedValue({});
    servicesProvidersRepositoryMock.findByIdsActive.mockResolvedValue([
      service,
    ]);
    appointmentsProvidersServicesRepositoryMock.create.mockResolvedValue({});
    transportsRepositoryMock.createAppointmentsTransport.mockResolvedValue({});
    appointmentsUsersTransactionsRepositoryMock.createAppointmentsUsersTransactions.mockResolvedValue(
      transaction
    );
    appointmentsTransactionsItensRepositoryMock.createAppointmentsTransactionsItens.mockResolvedValue(
      {}
    );
    appointmentsUsersTransactionsRepositoryMock.updatedAppointmentsUsersTransactions.mockResolvedValue(
      {}
    );
    // act
    await createAppointmentService.execute({
      appointment: {
        final_date: appointment.final_date,
        confirm: appointment.confirm,
        initial_date: appointment.initial_date,
      },
      users: [user],
      providers: [
        {
          provider,
        },
      ],
      local: address,
    });

    // assert
  });

  it("Not should able to create user already email exist", async () => {
    // arrange
    const [{ cpf, rg, email }] = usersFactory.generate({
      quantity: 1,
      active: false,
      id: "true",
    });

    usersRepositoryMock.findUserByEmailCpfRg.mockResolvedValue(undefined);

    // act
    // assert
    expect.assertions(2);
    await expect(
      activeAccountService.execute({
        cpf,
        rg,
        email,
      })
    ).rejects.toEqual(new AppError(NOT_FOUND.USER_DOES_NOT_EXIST));
    expect(usersRepositoryMock.findUserByEmailCpfRg).toHaveBeenCalledWith({
      cpf,
      rg,
      email,
    });
  });
});
