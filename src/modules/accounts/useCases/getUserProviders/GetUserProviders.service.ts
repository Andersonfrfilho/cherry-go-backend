import { instanceToInstance } from "class-transformer";
import { inject, injectable } from "tsyringe";

import { PaginationResponsePropsDTO } from "@modules/accounts/dtos/repositories/PaginationProps.dto";
import { User } from "@modules/accounts/infra/typeorm/entities/User";
import { UsersRepositoryInterface } from "@modules/accounts/repositories/Users.repository.interface";

export interface PaginationGetUserProvidersPropsDTO<T> {
  limit?: number;
  skip?: number;
  order?: string;
  fields?: Partial<T>;
}
@injectable()
export class GetUserProvidersService {
  constructor(
    @inject("UsersRepository")
    private usersRepository: UsersRepositoryInterface
  ) {}
  async execute({
    limit = 20,
    skip = 0,
    order = "created_at-",
    fields,
  }: PaginationGetUserProvidersPropsDTO<User>): Promise<
    PaginationResponsePropsDTO<User>
  > {
    const users = await this.usersRepository.findUsersProvidersWithPages({
      limit,
      skip,
      order,
    });

    return instanceToInstance(users);
  }
}
