import { ProvidersRepositoryInterface } from "@modules/accounts/repositories/Providers.repository.interface";

interface ProvidersRepositoryMock extends ProvidersRepositoryInterface {
  findById: jest.Mock<any, any>;
  createAddressProviders: jest.Mock<any, any>;
  findByIdsActiveAndServices: jest.Mock<any, any>;
  findByEmail: jest.Mock<any, any>;
  createDaysAvailable: jest.Mock<any, any>;
  createTimesAvailable: jest.Mock<any, any>;
  createServiceProvider: jest.Mock<any, any>;
  createPaymentTypesAvailable: jest.Mock<any, any>;
  createTransportTypesAvailable: jest.Mock<any, any>;
}

export const providersRepositoryMock: ProvidersRepositoryMock = {
  findById: jest.fn(),
  createAddressProviders: jest.fn(),
  findByIdsActiveAndServices: jest.fn(),
  findByEmail: jest.fn(),
  createDaysAvailable: jest.fn(),
  createTimesAvailable: jest.fn(),
  createServiceProvider: jest.fn(),
  createPaymentTypesAvailable: jest.fn(),
  createTransportTypesAvailable: jest.fn(),
};
