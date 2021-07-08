import {
  CreateAddressesRepositoryDTO,
  FindByIndiciesAddressesRepositoryDTO,
} from "@modules/addresses/dtos";
import { Address } from "@modules/addresses/infra/typeorm/entities/Address";

export interface AddressesRepositoryInterface {
  create(data: CreateAddressesRepositoryDTO): Promise<Address>;
  findIndices(data: FindByIndiciesAddressesRepositoryDTO): Promise<Address>;
}
