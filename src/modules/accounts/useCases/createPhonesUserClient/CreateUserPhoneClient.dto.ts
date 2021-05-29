import { User } from "@modules/accounts/infra/typeorm/entities/User";

export interface CreateUserPhoneClientDTO {
  user: User;
  token: string;
}
