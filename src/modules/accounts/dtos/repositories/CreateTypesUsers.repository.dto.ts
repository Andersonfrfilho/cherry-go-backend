import { USER_TYPES_ENUM } from "@modules/accounts/enums/UserTypes.enum";

export interface CreateTypesUsersRepositoryDTO {
  name: USER_TYPES_ENUM;
  active: boolean;
  description: string;
}
