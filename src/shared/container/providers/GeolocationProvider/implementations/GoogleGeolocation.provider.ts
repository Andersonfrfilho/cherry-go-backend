import { injectable } from "tsyringe";

import { config } from "@config/environment";
import {
  Client,
  ReverseGeocodeResponse,
  Language,
  AddressComponent,
  AddressType,
  GeocodingAddressComponentType,
} from "@googlemaps/google-maps-services-js";
import { Address } from "@modules/addresses/infra/typeorm/entities/Address";

import { GeocodingLatitudeLongitudeDTO } from "../dtos/geocodingLatitudeLongitude.dto";
import { ReverseGeocodingLatitudeLongitudeDTO } from "../dtos/reverseGeocodingLatitudeLongitude.dto copy";
import { GOOGLE_LANGUAGE_CODES_ENUM } from "../enums/geolocation.google.enum";
import { GeolocationProviderInterface } from "../Geolocation.provider.interface";

interface ParamsDTO {
  array_components: AddressComponent[];
  name_type: AddressType | GeocodingAddressComponentType | string;
}
function getInformationResultMaps({ name_type, array_components }: ParamsDTO) {
  const result = array_components.find((component) =>
    component.types.some((type) => type === name_type)
  );
  return result && result.long_name;
}

@injectable()
class GoogleGeolocationProvider implements GeolocationProviderInterface {
  private client: Client;

  constructor() {
    this.client = new Client({});
  }

  geocodingByLatitudeLongitude(
    data: GeocodingLatitudeLongitudeDTO
  ): Promise<any> {
    throw new Error("Method not implemented.");
  }
  async reverseGeocodingByLatitudeLongitude({
    latitude,
    longitude,
  }: ReverseGeocodingLatitudeLongitudeDTO): Promise<Address> {
    const googleMapClient = this.client;

    const { data } = await googleMapClient.reverseGeocode({
      params: {
        key: config.geolocation.api_key,
        latlng: `${latitude},${longitude}`,
        language: Language.pt_BR,
      },
    });

    const street_number = getInformationResultMaps({
      name_type: "street_number",
      array_components: data.results[0].address_components,
    });
    const street = getInformationResultMaps({
      name_type: "route",
      array_components: data.results[0].address_components,
    });
    const district = getInformationResultMaps({
      name_type: "sublocality_level_1",
      array_components: data.results[0].address_components,
    });
    const city = getInformationResultMaps({
      name_type: "administrative_area_level_2",
      array_components: data.results[0].address_components,
    });
    const state = getInformationResultMaps({
      name_type: "administrative_area_level_1",
      array_components: data.results[0].address_components,
    });
    const country = getInformationResultMaps({
      name_type: "country",
      array_components: data.results[0].address_components,
    });
    const zip_code = getInformationResultMaps({
      name_type: "postal_code",
      array_components: data.results[0].address_components,
    });
    const { formatted_address } = data.results[0];
    const google_latitude = data.results[0].geometry.location.lat;
    const google_longitude = data.results[0].geometry.location.lng;

    const address: Address = {} as Address;

    Object.assign(address, {
      street_number,
      street,
      district,
      city,
      state,
      country,
      zip_code,
      formatted_address,
      latitude: google_latitude,
      longitude: google_longitude,
    });

    return address;
  }
}

export { GoogleGeolocationProvider };
