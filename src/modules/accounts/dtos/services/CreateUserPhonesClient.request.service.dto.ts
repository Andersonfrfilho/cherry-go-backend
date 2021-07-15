import { User } from "@modules/accounts/infra/typeorm/entities/User";

export interface CreateUserPhonesClientServiceRequestDTO {
  user_id: string;
  country_code: string;
  number: string;
  ddd: string;
}
