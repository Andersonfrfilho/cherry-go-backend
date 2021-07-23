import { UsersRepositoryInterface } from "../Users.repository.interface";

const findUserByEmailCpfRgMock = jest.fn();
interface UsersRepositoryMock extends UsersRepositoryInterface {
  create: jest.Mock<any, any>;
  findUserByEmailCpfRg: jest.Mock<any, any>;
  createUserAddress: jest.Mock<any, any>;
  createUserPhones: jest.Mock<any, any>;
  findByEmail: jest.Mock<any, any>;
  findByRg: jest.Mock<any, any>;
  findByCpf: jest.Mock<any, any>;
  findById: jest.Mock<any, any>;
  findByIdWithDocument: jest.Mock<any, any>;
  updatePasswordUser: jest.Mock<any, any>;
  createUserClientType: jest.Mock<any, any>;
  updateActiveUser: jest.Mock<any, any>;
  updateActivePhoneUser: jest.Mock<any, any>;
  acceptTerms: jest.Mock<any, any>;
  createTagsUsersClient: jest.Mock<any, any>;
  insideTypeForUser: jest.Mock<any, any>;
  findByIdWithProfileImage: jest.Mock<any, any>;
  providerTypeForUser: jest.Mock<any, any>;
  findByIdsActive: jest.Mock<any, any>;
}

export const usersRepositoryMock: UsersRepositoryMock = {
  create: jest.fn(),
  createUserAddress: jest.fn(),
  createUserPhones: jest.fn(),
  findByEmail: jest.fn(),
  findByRg: jest.fn(),
  findByCpf: jest.fn(),
  findById: jest.fn(),
  findByIdWithDocument: jest.fn(),
  findUserByEmailCpfRg: findUserByEmailCpfRgMock,
  updatePasswordUser: jest.fn(),
  createUserClientType: jest.fn(),
  updateActiveUser: jest.fn(),
  updateActivePhoneUser: jest.fn(),
  acceptTerms: jest.fn(),
  createTagsUsersClient: jest.fn(),
  insideTypeForUser: jest.fn(),
  findByIdWithProfileImage: jest.fn(),
  providerTypeForUser: jest.fn(),
  findByIdsActive: jest.fn(),
};
