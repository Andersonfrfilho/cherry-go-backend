import { instanceToInstance } from "class-transformer";
import { inject, injectable } from "tsyringe";

import { UsersRepositoryInterface } from "@modules/accounts/repositories/Users.repository.interface";
import { AppError } from "@shared/errors/AppError";
import { NOT_FOUND } from "@shared/errors/constants";

interface ParamsDTO {
  user_id: string;
  active: boolean;
  user_type_user_id: string;
}
interface ParametersDTO {
  users: ParamsDTO[];
  limit: string;
  skip: string;
}

@injectable()
class ChangeUserTypeActiveUserProvidersService {
  constructor(
    @inject("UsersRepository")
    private usersRepository: UsersRepositoryInterface
  ) {}
  async execute({ users: data, limit, skip }: ParametersDTO): Promise<void> {
    const ids = data.map((userParam) => userParam.user_id);

    const users = await this.usersRepository.findUsers(ids);

    if (!ids.every((id) => users.some((userParam) => userParam.id === id))) {
      throw new AppError(NOT_FOUND.USERS_DOES_NOT_EXIST);
    }

    await this.usersRepository.updateActiveUsers(data);

    const new_users = await this.usersRepository.findUsersProvidersWithPages({
      limit: Number(limit),
      skip: Number(skip),
    });

    return instanceToInstance(new_users);
  }
}
export { ChangeUserTypeActiveUserProvidersService };
