import { Router } from "express";

import { GetCepController } from "@modules/accounts/useCases/getCep/GetCep.controller";
import { schemaGetCep } from "@modules/accounts/useCases/getCep/getCep.schema";
import { GetCitiesByStateController } from "@modules/accounts/useCases/getCitiesByState/GetCitiesByState.controller";
import { GetStatesController } from "@modules/accounts/useCases/getStates/GetStates.controller";
import { ensureAuthenticated } from "@shared/infra/http/middlewares/ensureAuthenticated";

const addressesRoutes = Router();

const getCepController = new GetCepController();
const getStatesController = new GetStatesController();
const getCitiesByStateController = new GetCitiesByStateController();

addressesRoutes.post(
  "/cep",
  ensureAuthenticated,
  schemaGetCep,
  getCepController.handle
);
addressesRoutes.get("/states", ensureAuthenticated, getStatesController.handle);
addressesRoutes.get(
  "/states/:state/cities",
  ensureAuthenticated,
  getCitiesByStateController.handle
);

export { addressesRoutes };
