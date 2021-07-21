import { User } from "@modules/accounts/infra/typeorm/entities/User";

export interface CreateUserPhonesClientServiceResponseDTO {
  user: User;
  token: string;
}
