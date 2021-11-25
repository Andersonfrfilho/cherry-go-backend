import { Router } from "express";

import { GetCepController } from "@modules/accounts/useCases/getCep/GetCep.controller";
import { schemaGetCep } from "@modules/accounts/useCases/getCep/getCep.schema";
import { ensureAuthenticated } from "@shared/infra/http/middlewares/ensureAuthenticated";

const addressesRoutes = Router();

const getCepController = new GetCepController();

addressesRoutes.post(
  "/cep",
  ensureAuthenticated,
  schemaGetCep,
  getCepController.handle
);

export { addressesRoutes };
