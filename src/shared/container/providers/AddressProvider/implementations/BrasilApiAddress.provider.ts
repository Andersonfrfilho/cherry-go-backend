import { injectable } from "tsyringe";

import { Client } from "@googlemaps/google-maps-services-js";
import { Address } from "@modules/addresses/infra/typeorm/entities/Address";

import { AddressProviderInterface } from "../Address.provider.interface";
import { apiBrailApi } from "./services/brasilApi.service";

@injectable()
class BrasilApiAddress implements AddressProviderInterface {
  async getCep(cep: string): Promise<Address> {
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

export { BrasilApiAddress };
