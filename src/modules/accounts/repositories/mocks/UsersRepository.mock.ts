const findUserByEmailCpfRgMock = jest.fn();

export const usersRepositoryMock = {
  findUserByEmailCpfRg: findUserByEmailCpfRgMock,
  createUserClientType: jest.fn(),
  create: jest.fn(),
  createUserAddress: jest.fn(),
  createUserPhones: jest.fn(),
  findByEmail: jest.fn(),
  findByRg: jest.fn(),
  findByCpf: jest.fn(),
  findById: jest.fn(),
  updatePasswordUser: jest.fn(),
  updateActiveUser: jest.fn(),
  updateActivePhoneUser: jest.fn(),
};
