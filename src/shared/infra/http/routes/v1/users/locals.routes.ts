import { Router } from "express";

import { GetAllLocalsTypesController } from "@modules/accounts/useCases/getAllLocalsTypes/GetAllLocalsTypes.controller";
import { GetGeolocationByAddressController } from "@modules/accounts/useCases/getGeolocationByAddress/GetGeolocationByAddress.controller";
import { schemaGetGeolocationByAddress } from "@modules/accounts/useCases/getGeolocationByAddress/getGeolocationByAddress.schema";
import { GetReverseGeolocationController } from "@modules/accounts/useCases/getReverseGeolocation/GetReverseGeolocation.controller";
import { schemaGetReverseGeolocation } from "@modules/accounts/useCases/getReverseGeolocation/getReverseGeolocation.schema";
import { ensureAuthenticated } from "@shared/infra/http/middlewares/ensureAuthenticated";

const localsRoutes = Router();

const getAllLocalsTypesController = new GetAllLocalsTypesController();
const getReverseGeolocationController = new GetReverseGeolocationController();
const getGeolocationByAddressController =
  new GetGeolocationByAddressController();

localsRoutes.get(
  "/types",
  ensureAuthenticated,
  getAllLocalsTypesController.handle
);

localsRoutes.post(
  "/geolocation/reverse",
  schemaGetReverseGeolocation,
  getReverseGeolocationController.handle
);

localsRoutes.post(
  "/geolocation/address",
  schemaGetGeolocationByAddress,
  getGeolocationByAddressController.handle
);

export { localsRoutes };
