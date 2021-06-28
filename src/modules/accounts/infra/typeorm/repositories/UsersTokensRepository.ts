import { getRepository, Repository } from "typeorm";

import {
  CreateUserTokenRepositoryDTO,
  FindByUserIdAndRefreshTokenRepositoryDTO,
} from "@modules/accounts/dtos";
import { UserTokens } from "@modules/accounts/infra/typeorm/entities/UserTokens";
import { UsersTokensRepositoryInterface } from "@modules/accounts/repositories/UsersTokensRepository.interface";

class UsersTokensRepository implements UsersTokensRepositoryInterface {
  private repository: Repository<UserTokens>;

  constructor() {
    this.repository = getRepository(UserTokens);
  }

  async findByRefreshToken(refresh_token: string): Promise<UserTokens> {
    const userToken = await this.repository.findOne({ refresh_token });
    return userToken;
  }

  async deleteById(user_token_id: string): Promise<void> {
    await this.repository.delete(user_token_id);
  }

  async findByUserIdAndRefreshToken({
    user_id,
    refresh_token,
  }: FindByUserIdAndRefreshTokenRepositoryDTO): Promise<UserTokens> {
    const users_tokens = await this.repository.findOne({
      where: { user_id, refresh_token },
    });
    return users_tokens;
  }

  async create({
    expires_date,
    refresh_token,
    user_id,
  }: CreateUserTokenRepositoryDTO): Promise<UserTokens> {
    const user_token = this.repository.create({
      expires_date,
      refresh_token,
      user_id,
    });
    await this.repository.save(user_token);
    return user_token;
  }
}
export { UsersTokensRepository };
