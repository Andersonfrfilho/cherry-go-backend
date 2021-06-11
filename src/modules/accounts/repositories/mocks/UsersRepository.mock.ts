const findUserByEmailCpfRgMock = jest.fn();

export const usersRepositoryMock = {
  create: jest.fn(),
  createUserAddress: jest.fn(),
  createUserPhones: jest.fn(),
  findByEmail: jest.fn(),
  findByRg: jest.fn(),
  findByCpf: jest.fn(),
  findById: jest.fn(),
  findByIdWithDocument: jest.fn(),
  findUserByEmailCpfRg: findUserByEmailCpfRgMock,
  createUserClientType: jest.fn(),
  updatePasswordUser: jest.fn(),
  updateActiveUser: jest.fn(),
  updateActivePhoneUser: jest.fn(),
  acceptTerms: jest.fn(),
  createTagsUsers: jest.fn(),
  findByIdWithProfileImage: jest.fn(),
};
