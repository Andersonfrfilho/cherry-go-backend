import { inject, injectable } from "tsyringe";

import { CreateTagUsersServiceDTO } from "@modules/accounts/dtos";
import { IUsersRepository } from "@modules/accounts/repositories/IUsersRepository";
import { AppError } from "@shared/errors/AppError";

@injectable()
class CreateTagsUsersService {
  constructor(
    @inject("UsersRepository")
    private usersRepository: IUsersRepository
  ) {}
  async execute({ tags, user_id }: CreateTagUsersServiceDTO): Promise<void> {
    const user = await this.usersRepository.findById(user_id);

    if (!user) {
      throw new AppError({ message: "User not exist!" });
    }

    await this.usersRepository.createTagsUsers({ tags, user_id });
  }
}
export { CreateTagsUsersService };
