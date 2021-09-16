import { Router } from "express";

import { AuthenticateUserProviderController } from "@modules/accounts/useCases/authenticateUserProvider/AuthenticateUserProvider.controller";
import { schemaAuthenticateProvider } from "@modules/accounts/useCases/authenticateUserProvider/authenticateUserProvider.schema";
import { CreateProviderDaysAvailabilitiesController } from "@modules/accounts/useCases/createProviderDaysAvailabilities/CreateProviderDaysAvailabilities.controller";
import { schemaCreateProviderDaysAvailabilities } from "@modules/accounts/useCases/createProviderDaysAvailabilities/createProviderDaysAvailabilities.schema";
import { CreateProvidersPaymentsTypesController } from "@modules/accounts/useCases/createProvidersPaymentsTypes/CreateProvidersPaymentsTypes.controller";
import { schemaCreateProvidersPaymentsTypes } from "@modules/accounts/useCases/createProvidersPaymentsTypes/createProvidersPaymentsTypes.schema";
import { CreateProviderTimesAvailabilitiesController } from "@modules/accounts/useCases/createProviderTimesAvailabilities/CreateProviderTimesAvailabilities.controller";
import { schemaCreateProviderTimesAvailabilities } from "@modules/accounts/useCases/createProviderTimesAvailabilities/createProviderTimesAvailabilities.schema";
import { CreateProviderTransportTypesAvailabilitiesController } from "@modules/accounts/useCases/createProviderTransportTypesAvailabilities/CreateProviderTransportTypesAvailabilities.controller";
import { schemaCreateProviderTransportTypesAvailabilities } from "@modules/accounts/useCases/createProviderTransportTypesAvailabilities/createProviderTransportTypesAvailabilities.schema";
import { CreateServiceProviderController } from "@modules/accounts/useCases/createServiceProvider/CreateServiceProvider.controller";
import { schemaCreateServiceProvider } from "@modules/accounts/useCases/createServiceProvider/createServiceProvider.schema";
import { CreateUsersTypeProvidersController } from "@modules/accounts/useCases/createUsersTypeProviders/CreateUsersTypeProviders.controller";
import { ensureAuthenticated } from "@shared/infra/http/middlewares/ensureAuthenticated";
import { ensureAuthenticatedProvider } from "@shared/infra/http/middlewares/ensureAuthenticatedProvider";

const providersRoutes = Router();
const createUsersProvidersController = new CreateUsersProvidersController();
const createUsersTypeProvidersController = new CreateUsersTypeProvidersController();
const authenticateUserProviderController = new AuthenticateUserProviderController();
const createProviderTimesAvailabilitiesController = new CreateProviderTimesAvailabilitiesController();
const createProviderDaysAvailabilitiesController = new CreateProviderDaysAvailabilitiesController();
const createServiceProviderController = new CreateServiceProviderController();
const createProvidersPaymentsTypesController = new CreateProvidersPaymentsTypesController();
const createProviderTransportTypesAvailabilitiesController = new CreateProviderTransportTypesAvailabilitiesController();

providersRoutes.post(
  "/",
  ensureAuthenticated,
  createUsersTypeProvidersController.handle
);

providersRoutes.patch(
  "/",
  ensureAuthenticated,
  createUsersTypeProvidersController.handle
);

providersRoutes.post(
  "/sessions",
  schemaAuthenticateProvider,
  authenticateUserProviderController.handle
);

providersRoutes.patch(
  "/days",
  ensureAuthenticatedProvider,
  schemaCreateProviderDaysAvailabilities,
  createProviderDaysAvailabilitiesController.handle
);

providersRoutes.patch(
  "/hours",
  ensureAuthenticatedProvider,
  schemaCreateProviderTimesAvailabilities,
  createProviderTimesAvailabilitiesController.handle
);

providersRoutes.patch(
  "/services",
  ensureAuthenticatedProvider,
  schemaCreateServiceProvider,
  createServiceProviderController.handle
);

providersRoutes.patch(
  "/payments_types",
  ensureAuthenticatedProvider,
  schemaCreateProvidersPaymentsTypes,
  createProvidersPaymentsTypesController.handle
);

providersRoutes.patch(
  "/transport_types",
  ensureAuthenticatedProvider,
  schemaCreateProviderTransportTypesAvailabilities,
  createProviderTransportTypesAvailabilitiesController.handle
);

export { providersRoutes };
