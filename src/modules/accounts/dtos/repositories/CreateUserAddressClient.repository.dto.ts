import { User } from "@modules/accounts/infra/typeorm/entities/User";

export interface CreateUserAddressClientRepositoryDTO {
  user: User;
  street: string;
  number: string;
  zipcode: string;
  district: string;
  city: string;
  state: string;
  country: string;
  latitude: string;
  longitude: string;
  complement: string;
  reference: string;
}
