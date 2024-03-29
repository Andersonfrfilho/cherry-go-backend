import { TYPE_USER_TOKEN_ENUM } from "@modules/accounts/enums/TypeUserToken.enum";

export interface CreateUserTokenRepositoryDTO {
  user_id?: string;
  expires_date: Date;
  refresh_token: string;
  type: TYPE_USER_TOKEN_ENUM;
}
