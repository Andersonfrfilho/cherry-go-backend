import { inject, injectable } from "tsyringe";

import { RequestActiveUserClientServiceDTO } from "@modules/accounts/dtos";
import { UsersRepositoryInterface } from "@modules/accounts/repositories/Users.repository.interface";
import { AppError } from "@shared/errors/AppError";
import { BAD_REQUEST } from "@shared/errors/constants";

@injectable()
class ActiveAccountService {
  constructor(
    @inject("UsersRepository")
    private usersRepository: UsersRepositoryInterface
  ) {}
  async execute({
    cpf,
    rg,
    email,
  }: Partial<RequestActiveUserClientServiceDTO>): Promise<void> {
    const user = await this.usersRepository.findUserByEmailCpfRg({
      email,
      cpf,
      rg,
    });

    if (!user) {
      throw new AppError(BAD_REQUEST.USER_NOT_EXIST);
    }

    await this.usersRepository.updateActiveUser({
      id: user.id,
      active: true,
    });
  }
}
export { ActiveAccountService };
