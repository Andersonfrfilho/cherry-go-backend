import { User } from "@modules/accounts/infra/typeorm/entities/User";

interface ICreateUserAddressClientDTO {
  user: User;
  street: string;
  number: string;
  zipcode: string;
  district: string;
  city: string;
  state: string;
  country: string;
}
export { ICreateUserAddressClientDTO };
