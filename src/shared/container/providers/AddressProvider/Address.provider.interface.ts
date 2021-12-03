import { Address } from "@modules/addresses/infra/typeorm/entities/Address";

import { STATE_SIGLA_ENUM } from "./enums/address.enum";

interface AddressProviderInterface {
  getAddressByCep(cep: string): Promise<Address>;
  getStates(): Promise<any>;
  getCitiesByState(state: STATE_SIGLA_ENUM): Promise<any>;
}

export { AddressProviderInterface };
