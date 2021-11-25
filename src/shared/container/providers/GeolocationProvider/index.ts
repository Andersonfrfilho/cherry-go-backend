import { container } from "tsyringe";

import { config } from "@config/environment";

import { GeolocationProviderInterface } from "./Geolocation.provider.interface";
import { GoogleGeolocationProvider } from "./implementations/GoogleGeolocation.provider";

const geolocationProvider = {
  google: container.resolve(GoogleGeolocationProvider),
};

container.registerInstance<GeolocationProviderInterface>(
  "GeolocationProvider",
  geolocationProvider[config.geolocation.provider]
);
