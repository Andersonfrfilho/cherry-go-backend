import { User } from "@modules/accounts/infra/typeorm/entities/User";

export interface UserResponseDTO {
  user: Partial<User>;
}
