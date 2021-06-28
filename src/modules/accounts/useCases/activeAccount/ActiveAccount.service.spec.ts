import "reflect-metadata";

import { usersRepositoryMock } from "@modules/accounts/repositories/mocks/UsersRepository.mock";
import { ActiveAccountService } from "@modules/accounts/useCases/activeAccount/ActiveAccount.service";
import { AppError } from "@shared/errors/AppError";
import { BAD_REQUEST } from "@shared/errors/constants";
import {
  ImagesFactory,
  PhonesFactory,
  UsersFactory,
  UsersTypesFactory,
  UserTermFactory,
} from "@shared/infra/typeorm/factories";

let activeAccountService: ActiveAccountService;
const mocked_date = new Date("2020-09-01T09:33:37");
jest.mock("uuid");
jest.useFakeTimers("modern").setSystemTime(mocked_date.getTime());

describe("ActiveAccountService", () => {
  const usersFactory = new UsersFactory();
  const phonesFactory = new PhonesFactory();
  const imagesFactory = new ImagesFactory();
  const userTermFactory = new UserTermFactory();
  const usersTypesFactory = new UsersTypesFactory();

  beforeEach(() => {
    activeAccountService = new ActiveAccountService(usersRepositoryMock);
  });

  it("Should be able to active an user", async () => {
    // arrange
    const [
      { cpf, rg, email, id, active, name, last_name },
    ] = usersFactory.generate({
      quantity: 1,
      active: false,
      id: "true",
    });
    const phones = phonesFactory.generate({ quantity: 1, id: "true" });
    const addresses = phonesFactory.generate({ quantity: 1, id: "true" });
    const image_profile = imagesFactory.generate({ quantity: 1, id: "true" });
    const [type] = usersTypesFactory.generate();
    const [term] = userTermFactory.generate({ quantity: 1, accept: false });
    usersRepositoryMock.findUserByEmailCpfRg.mockResolvedValue({
      cpf,
      rg,
      email,
      id,
      active,
      name,
      last_name,
      phones,
      addresses,
      image_profile: [{ image: image_profile }],
      types: [type],
      term: [term],
    });
    usersRepositoryMock.updateActiveUser.mockResolvedValue({});

    // act
    await activeAccountService.execute({
      cpf,
      rg,
      email,
    });

    // assert
    expect(usersRepositoryMock.findUserByEmailCpfRg).toHaveBeenCalledWith({
      cpf,
      rg,
      email,
    });
    expect(usersRepositoryMock.updateActiveUser).toHaveBeenCalledWith({
      id,
      active: true,
    });
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
    ).rejects.toEqual(new AppError(BAD_REQUEST.USER_NOT_EXIST));
    expect(usersRepositoryMock.findUserByEmailCpfRg).toHaveBeenCalledWith({
      cpf,
      rg,
      email,
    });
  });
});
