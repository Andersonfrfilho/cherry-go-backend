import { GeocodingByAddressDTO } from "./dtos/geocodingLatitudeLongitude.dto";
import { ReverseGeocodingLatitudeLongitudeDTO } from "./dtos/reverseGeocodingLatitudeLongitude.dto copy";

interface GeolocationProviderInterface {
  geocodingByAddress(address: string): Promise<any>;
  reverseGeocodingByLatitudeLongitude(
    data: ReverseGeocodingLatitudeLongitudeDTO
  ): Promise<any>;
}

export { GeolocationProviderInterface };
