import { Router } from "express";

import { CreateUsersTypeProvidersController } from "@modules/accounts/useCases/createUsersTypeProviders/CreateUsersTypeProviders.controller";
import { ensureAuthenticated } from "@shared/infra/http/middlewares/ensureAuthenticated";

const providersRoutes = Router();
const createUsersTypeProvidersController = new CreateUsersTypeProvidersController();

providersRoutes.patch(
  "/",
  ensureAuthenticated,
  createUsersTypeProvidersController.handle
);

export { providersRoutes };
