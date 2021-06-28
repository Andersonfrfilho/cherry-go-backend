export const usersTokensRepositoryMock = {
  create: jest.fn(),
  findByUserIdAndRefreshToken: jest.fn(),
  deleteById: jest.fn(),
  findByRefreshToken: jest.fn(),
};
