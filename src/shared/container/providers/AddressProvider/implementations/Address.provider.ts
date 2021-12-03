import { injectable } from "tsyringe";

import { Address } from "@modules/addresses/infra/typeorm/entities/Address";

import { AddressProviderInterface } from "../Address.provider.interface";
import { STATES_CONST } from "../const/states.const";
import { STATE_SIGLA_ENUM } from "../enums/address.enum";
import { apiBrailApi } from "./services/brasilApi.service";

interface Region {
  id: number;
  sigla: string;
  nome: string;
}

export interface State {
  id: number;
  sigla: STATE_SIGLA_ENUM;
  nome: string;
  regiao: Region;
}
@injectable()
class AddressProvider implements AddressProviderInterface {
  async getStates(): Promise<State> {
    let states;
    try {
      const { data } = await apiBrailApi.get(`/ibge/uf/v1`);
      states = data.sort((a, b) => a.nome.localeCompare(b.nome));
    } catch {
    } finally {
      return states.length ? states : STATES_CONST;
    }
  }

  async getCitiesByState(state: STATE_SIGLA_ENUM): Promise<any> {
    const { data } = await apiBrailApi.get(`/ibge/municipios/v1/${state}`);
    const cities = data.map((city) => city.nome);
    return cities;
  }

  async getAddressByCep(cep: string): Promise<Address> {
    const address: Address = {} as Address;
    Object.assign(address, {
      zipcode: "",
      state: "",
      city: "",
      district: "",
      street: "",
      latitude: "",
      longitude: "",
    });
    try {
      const { data } = await apiBrailApi.get(`/cep/v2/${cep}`);

      Object.assign(address, {
        zipcode: data?.cep,
        state: data?.state,
        city: data?.city,
        district: data?.neighborhood,
        street: data?.street,
        latitude: data?.coordinates?.latitude,
        longitude: data?.coordinates?.longitude,
      });
    } catch {
    } finally {
      return address;
    }
  }
}

export { AddressProvider };
