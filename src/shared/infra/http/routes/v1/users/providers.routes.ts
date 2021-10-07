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
import { CreateUserProviderController } from "@modules/accounts/useCases/createUserProvider/CreateUserProvider.controller";
import { schemaCreateUserProvider } from "@modules/accounts/useCases/createUserProvider/createUserProvider.schema";
import { CreateUsersTypeProvidersController } from "@modules/accounts/useCases/createUsersTypeProviders/CreateUsersTypeProviders.controller";
import { MeProfileUserProviderController } from "@modules/accounts/useCases/meProfileUserProvider/MeProfileUserProvider.controller";
import { ConfirmAppointmentProviderController } from "@modules/appointments/useCases/confirmAppointmentProvider/ConfirmAppointmentProvider.controller";
import { schemaConfirmAppointmentProvider } from "@modules/appointments/useCases/confirmAppointmentProvider/confirmAppointmentProvider.schema";
import { RejectAppointmentProviderController } from "@modules/appointments/useCases/rejectAppointmentProvider/RejectAppointmentProvider.controller";
import { schemaRejectAppointmentProvider } from "@modules/appointments/useCases/rejectAppointmentProvider/rejectAppointmentProvider.schema";
import { ensureAuthenticated } from "@shared/infra/http/middlewares/ensureAuthenticated";
import { ensureAuthenticatedProvider } from "@shared/infra/http/middlewares/ensureAuthenticatedProvider";

const providersRoutes = Router();
const createUserProviderController = new CreateUserProviderController();
const createUsersTypeProvidersController = new CreateUsersTypeProvidersController();
const authenticateUserProviderController = new AuthenticateUserProviderController();
const meProfileUserProviderController = new MeProfileUserProviderController();
const createProviderTimesAvailabilitiesController = new CreateProviderTimesAvailabilitiesController();
const createProviderDaysAvailabilitiesController = new CreateProviderDaysAvailabilitiesController();
const createServiceProviderController = new CreateServiceProviderController();
const createProvidersPaymentsTypesController = new CreateProvidersPaymentsTypesController();
const createProviderTransportTypesAvailabilitiesController = new CreateProviderTransportTypesAvailabilitiesController();
const confirmAppointmentProviderController = new ConfirmAppointmentProviderController();
const rejectAppointmentProviderController = new RejectAppointmentProviderController();

providersRoutes.post(
  "/",
  schemaCreateUserProvider,
  createUserProviderController.handle
);

providersRoutes.get(
  "/me",
  ensureAuthenticatedProvider,
  meProfileUserProviderController.handle
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

providersRoutes.patch(
  "/appointment/confirm",
  ensureAuthenticatedProvider,
  schemaConfirmAppointmentProvider,
  confirmAppointmentProviderController.handle
);

providersRoutes.patch(
  "/appointment/reject",
  ensureAuthenticatedProvider,
  schemaRejectAppointmentProvider,
  rejectAppointmentProviderController.handle
);

export { providersRoutes };
