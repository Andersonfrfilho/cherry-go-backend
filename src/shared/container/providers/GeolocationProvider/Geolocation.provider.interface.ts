import {
  GetDistanceTwoAddressDTO,
  ReverseGeocodingLatitudeLongitudeDTO,
} from "./dtos/geolocation.dto";

interface GeolocationProviderInterface {
  geocodingByAddress(address: string): Promise<any>;
  reverseGeocodingByLatitudeLongitude(
    data: ReverseGeocodingLatitudeLongitudeDTO
  ): Promise<any>;
  getDistanceTwoAddress(data: GetDistanceTwoAddressDTO): Promise<any>;
}

export { GeolocationProviderInterface };
