import { Router } from "express";

import { CreateProviderDaysAvailabilitiesController } from "@modules/accounts/useCases/createProviderDaysAvailabilities/CreateProviderDaysAvailabilities.controller";
import { CreateProviderTimesAvailabilitiesController } from "@modules/accounts/useCases/createProviderTimesAvailabilities/CreateProviderTimesAvailabilities.controller";
import { CreateUsersTypeProvidersController } from "@modules/accounts/useCases/createUsersTypeProviders/CreateUsersTypeProviders.controller";
import { ensureAuthenticated } from "@shared/infra/http/middlewares/ensureAuthenticated";
import { ensureAuthenticatedProvider } from "@shared/infra/http/middlewares/ensureAuthenticatedProvider";

const providersRoutes = Router();
const createUsersTypeProvidersController = new CreateUsersTypeProvidersController();
const createProviderTimesAvailabilitiesController = new CreateProviderTimesAvailabilitiesController();
const createProviderDaysAvailabilitiesController = new CreateProviderDaysAvailabilitiesController();

providersRoutes.patch(
  "/",
  ensureAuthenticated,
  createUsersTypeProvidersController.handle
);

providersRoutes.patch(
  "/days",
  ensureAuthenticated,
  ensureAuthenticatedProvider,
  createProviderDaysAvailabilitiesController.handle
);

providersRoutes.patch(
  "/hours",
  ensureAuthenticated,
  ensureAuthenticatedProvider,
  createProviderTimesAvailabilitiesController.handle
);

export { providersRoutes };
