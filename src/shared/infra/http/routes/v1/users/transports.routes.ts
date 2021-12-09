import { Router } from "express";

import { GetTransportTypesController } from "@modules/transports/useCases/getTransportTypes/GetTransportTypes.controller";
import { ensureAuthenticated } from "@shared/infra/http/middlewares/ensureAuthenticated";

const transportsRoutes = Router();

const getTransportTypesController = new GetTransportTypesController();

transportsRoutes.get(
  "/types",
  ensureAuthenticated,
  getTransportTypesController.handle
);

export { transportsRoutes };
