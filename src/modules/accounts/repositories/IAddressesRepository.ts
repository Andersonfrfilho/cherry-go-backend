import { ICreateUserAddressClientDTO } from "@modules/accounts/dtos";
import { Address } from "@modules/accounts/infra/typeorm/entities/Address";

interface IAddressesRepository {
  create(data: ICreateUserAddressClientDTO): Promise<Address>;
}

export { IAddressesRepository };
