import { ICreateUserAddressClientDTO } from "@modules/accounts/dtos";
import { Address } from "@modules/accounts/infra/typeorm/entities/Address";

interface AddressesRepositoryInterface {
  create(data: ICreateUserAddressClientDTO): Promise<Address>;
}

export { AddressesRepositoryInterface };
