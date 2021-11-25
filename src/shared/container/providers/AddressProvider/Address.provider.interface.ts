import { Address } from "@modules/addresses/infra/typeorm/entities/Address";

interface AddressProviderInterface {
  getCep(cep: string): Promise<Address>;
}

export { AddressProviderInterface };
