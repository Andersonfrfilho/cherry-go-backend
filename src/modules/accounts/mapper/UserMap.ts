import { instanceToInstance } from "class-transformer";

import { User } from "@modules/accounts/infra/typeorm/entities/User";

import { UserResponseDTO } from "../dtos/response/UserResponse.dto";

class UserMap {
  static toDTO(data: User): UserResponseDTO {
    const user = instanceToInstance({
      ...data,
    });
    return user;
  }
}

export { UserMap };
