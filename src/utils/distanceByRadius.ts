const RADIUS_EARTH = 6371;

interface DistanceRadiusCalculationParamsDTO {
  currentLatitude: number;
  currentLongitude: number;
  latitude: number;
  longitude: number;
  distance: number;
}

function degrees_to_radians(degrees: number): number {
  const pi = Math.PI;
  return degrees * (pi / 180);
}

export function distanceRadiusCalculation({
  currentLatitude,
  currentLongitude,
  latitude,
  longitude,
  distance,
}: DistanceRadiusCalculationParamsDTO) {
  return (
    RADIUS_EARTH *
      Math.acos(
        Math.cos(degrees_to_radians(currentLatitude)) *
          Math.cos(degrees_to_radians(latitude)) *
          Math.cos(
            degrees_to_radians(currentLongitude) - degrees_to_radians(longitude)
          ) +
          Math.sin(degrees_to_radians(currentLatitude)) *
            Math.sin(degrees_to_radians(latitude))
      ) <=
    distance
  );
}
