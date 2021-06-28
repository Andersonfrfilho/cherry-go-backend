import {
  CreateUserTokenRepositoryDTO,
  FindByUserIdAndRefreshTokenRepositoryDTO,
} from "@modules/accounts/dtos";
import { UserTokens } from "@modules/accounts/infra/typeorm/entities/UserTokens";

export interface UsersTokensRepositoryInterface {
  create({
    expires_date,
    user_id,
    refresh_token,
  }: CreateUserTokenRepositoryDTO): Promise<UserTokens>;
  findByUserIdAndRefreshToken({
    user_id,
    refresh_token,
  }: FindByUserIdAndRefreshTokenRepositoryDTO): Promise<UserTokens>;
  deleteById(user_token_id: string): Promise<void>;
  findByRefreshToken(refresh_token: string): Promise<UserTokens>;
}
