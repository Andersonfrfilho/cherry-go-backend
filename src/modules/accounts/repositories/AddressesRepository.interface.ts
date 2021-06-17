import { CreateUserAddressClientRepositoryDTO } from "@modules/accounts/dtos";
import { Address } from "@modules/accounts/infra/typeorm/entities/Address";

export interface AddressesRepositoryInterface {
  create(data: CreateUserAddressClientRepositoryDTO): Promise<Address>;
}
