import { inject, injectable } from "tsyringe";

import { CreateTagsUsersClientServiceDTO } from "@modules/accounts/dtos";
import { UsersRepositoryInterface } from "@modules/accounts/repositories/Users.repository.interface";
import { AppError } from "@shared/errors/AppError";
import { NOT_FOUND } from "@shared/errors/constants";

@injectable()
class CreateTagsUsersClientService {
  constructor(
    @inject("UsersRepository")
    private usersRepository: UsersRepositoryInterface
  ) {}
  async execute({
    tags,
    client_id,
  }: CreateTagsUsersClientServiceDTO): Promise<void> {
    const user = await this.usersRepository.findById(client_id);

    if (!user) {
      throw new AppError(NOT_FOUND.USER_DOES_NOT_EXIST);
    }

    await this.usersRepository.createTagsUsersClient({ tags, client_id });
  }
}
export { CreateTagsUsersClientService };
