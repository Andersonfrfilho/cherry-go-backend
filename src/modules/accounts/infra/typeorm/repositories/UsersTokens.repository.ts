import { getRepository, Repository } from "typeorm";

import {
  CreateUserTokenRepositoryDTO,
  FindByUserIdAndRefreshTokenRepositoryDTO,
} from "@modules/accounts/dtos";
import { deleteByUserIdType } from "@modules/accounts/dtos/repositories/DeleteByUserIdType.repository.interface";
import { TYPE_USER_TOKEN_ENUM } from "@modules/accounts/enums/TypeUserToken.enum";
import { UserTokens } from "@modules/accounts/infra/typeorm/entities/UserTokens";
import { UsersTokensRepositoryInterface } from "@modules/accounts/repositories/UsersTokens.repository.interface";

class UsersTokensRepository implements UsersTokensRepositoryInterface {
  private repository: Repository<UserTokens>;

  constructor() {
    this.repository = getRepository(UserTokens);
  }
  async deleteByUserIdType({
    type,
    user_id,
  }: deleteByUserIdType): Promise<void> {
    const user_tokens = await this.repository.find({ type, user_id });
    await this.repository.remove(user_tokens);
  }

  async findByUserAndRemoveTokens(id: string): Promise<void> {
    const user_tokens = await this.repository.find({ where: { user_id: id } });

    await this.repository.remove(user_tokens);
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
    type,
  }: CreateUserTokenRepositoryDTO): Promise<UserTokens> {
    const user_token = this.repository.create({
      expires_date,
      refresh_token,
      user_id,
      type,
    });
    await this.repository.save(user_token);
    return user_token;
  }
}
export { UsersTokensRepository };
