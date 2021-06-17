import { UserTypesEnum } from "@modules/accounts/enums/UserTypes.enum";

export interface CreateTypesUsersRepositoryDTO {
  name: UserTypesEnum;
  active: boolean;
  description: string;
}
