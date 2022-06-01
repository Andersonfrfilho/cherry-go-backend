import { TYPE_USER_TOKEN_ENUM } from "@modules/accounts/enums/TypeUserToken.enum";

export interface deleteByUserIdType {
  type: TYPE_USER_TOKEN_ENUM;
  user_id: string;
}
