import { GeocodingLatitudeLongitudeDTO } from "./dtos/geocodingLatitudeLongitude.dto";
import { ReverseGeocodingLatitudeLongitudeDTO } from "./dtos/reverseGeocodingLatitudeLongitude.dto copy";

interface GeolocationProviderInterface {
  geocodingByLatitudeLongitude(
    data: GeocodingLatitudeLongitudeDTO
  ): Promise<any>;
  reverseGeocodingByLatitudeLongitude(
    data: ReverseGeocodingLatitudeLongitudeDTO
  ): Promise<any>;
}

export { GeolocationProviderInterface };
