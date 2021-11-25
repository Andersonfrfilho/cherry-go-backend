import { Router } from "express";

import { GetAllLocalsTypesController } from "@modules/accounts/useCases/getAllLocalsTypes/GetAllLocalsTypes.controller";
import { GetReverseGeolocationController } from "@modules/accounts/useCases/getReverseGeolocation/GetReverseGeolocation.controller";
import { schemaGetReverseGeolocation } from "@modules/accounts/useCases/getReverseGeolocation/getReverseGeolocation.schema";
import { ensureAuthenticated } from "@shared/infra/http/middlewares/ensureAuthenticated";

const localsRoutes = Router();

const getAllLocalsTypesController = new GetAllLocalsTypesController();
const getReverseGeolocationController = new GetReverseGeolocationController();

localsRoutes.get(
  "/types",
  ensureAuthenticated,
  getAllLocalsTypesController.handle
);

localsRoutes.post(
  "/geolocation/reverse",
  ensureAuthenticated,
  schemaGetReverseGeolocation,
  getReverseGeolocationController.handle
);

export { localsRoutes };
