import { Router } from "express";

import { CreateTariffsController } from "@modules/tariffs/useCases/createTariffs/CreateTariffs.controller";
import { schemaCreateTariffs } from "@modules/tariffs/useCases/createTariffs/createTariffs.schema";
import { GetSpecifiesTariffsController } from "@modules/tariffs/useCases/getSpecifiesTariffs/GetSpecifiesTariffs.controller";
import { GetTariffsController } from "@modules/tariffs/useCases/getTariffs/GetTariffs.controller";
import { ensureAuthenticated } from "@shared/infra/http/middlewares/ensureAuthenticated";

const tariffsRoutes = Router();

const createTariffsController = new CreateTariffsController();
const getTariffsController = new GetTariffsController();
const getSpecifiesTariffsController = new GetSpecifiesTariffsController();

tariffsRoutes.post(
  "/",
  ensureAuthenticated,
  schemaCreateTariffs,
  createTariffsController.handle
);
tariffsRoutes.get(
  "/",
  ensureAuthenticated,
  getSpecifiesTariffsController.handle
);
tariffsRoutes.get("/:type", ensureAuthenticated, getTariffsController.handle);

export { tariffsRoutes };
