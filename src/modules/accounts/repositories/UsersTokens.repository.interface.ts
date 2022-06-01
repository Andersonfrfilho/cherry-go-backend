import {
  CreateUserTokenRepositoryDTO,
  FindByUserIdAndRefreshTokenRepositoryDTO,
} from "@modules/accounts/dtos";
import { UserTokens } from "@modules/accounts/infra/typeorm/entities/UserTokens";

import { deleteByUserIdType } from "../dtos/repositories/DeleteByUserIdType.repository.interface";

export interface UsersTokensRepositoryInterface {
  create(data: CreateUserTokenRepositoryDTO): Promise<UserTokens>;
  findByUserIdAndRefreshToken({
    user_id,
    refresh_token,
  }: FindByUserIdAndRefreshTokenRepositoryDTO): Promise<UserTokens>;
  deleteById(user_token_id: string): Promise<void>;
  findByRefreshToken(refresh_token: string): Promise<UserTokens>;
  findByUserAndRemoveTokens(refresh_token: string): Promise<void>;
  deleteByUserIdType(data: deleteByUserIdType): Promise<void>;
}
