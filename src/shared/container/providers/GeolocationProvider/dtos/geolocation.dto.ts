import { Address } from "@modules/addresses/infra/typeorm/entities/Address";

export interface GeocodingByAddressDTO {
  latitude: string;
  longitude: string;
}
export interface ReverseGeocodingLatitudeLongitudeDTO {
  latitude: string;
  longitude: string;
}
export interface GetDistanceTwoAddressDTO {
  local_initial: Address;
  local_destination: Address;
  departure_time: number;
}
