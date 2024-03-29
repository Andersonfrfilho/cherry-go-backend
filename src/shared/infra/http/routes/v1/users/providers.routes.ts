import { Router } from "express";
import multer from "multer";

import uploadConfig from "@config/upload";
import { AuthenticateUserProviderController } from "@modules/accounts/useCases/authenticateUserProvider/AuthenticateUserProvider.controller";
import { schemaAuthenticateProvider } from "@modules/accounts/useCases/authenticateUserProvider/authenticateUserProvider.schema";
import { ChangeUserTypeActiveUserProvidersController } from "@modules/accounts/useCases/changeUserTypeActiveUserProviders/ChangeUserTypeActiveUserProviders.controller";
import { CreateLocalProviderController } from "@modules/accounts/useCases/createLocalProvider/CreateLocalProvider.controller";
import { schemaCreateLocalProviders } from "@modules/accounts/useCases/createLocalProvider/createLocalsProviders.schema";
import { CreateProviderDaysAvailabilitiesController } from "@modules/accounts/useCases/createProviderDaysAvailabilities/CreateProviderDaysAvailabilities.controller";
import { schemaCreateProviderDaysAvailabilities } from "@modules/accounts/useCases/createProviderDaysAvailabilities/createProviderDaysAvailabilities.schema";
import { CreateProvidersLocalsTypesController } from "@modules/accounts/useCases/createProvidersLocalsTypes/CreateProvidersLocalsTypes.controller";
import { schemaCreateProvidersLocalsTypes } from "@modules/accounts/useCases/createProvidersLocalsTypes/createProvidersLocalsTypes.schema";
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
import { DeleteLocalsProviderController } from "@modules/accounts/useCases/deleteLocalsProvider/DeleteLocalsProvider.controller";
import { schemaDeleteLocalsProviders } from "@modules/accounts/useCases/deleteLocalsProvider/deleteLocalsProvider.schema";
import { DeleteProvidersLocalsTypesController } from "@modules/accounts/useCases/deleteLocalsTypesProviders/DeleteLocalsTypesProviders.controller";
import { schemaDeleteLocalsTypesProviders } from "@modules/accounts/useCases/deleteLocalsTypesProviders/deleteLocalsTypesProviders.schema";
import { DeletePhotosProviderController } from "@modules/accounts/useCases/deletePhotosProvider/DeletePhotosProvider.controller";
import { DeleteProviderTimesAvailabilitiesController } from "@modules/accounts/useCases/deleteProviderTimesAvailabilities/DeleteProviderTimesAvailabilities.controller";
import { schemaDeleteProviderTimesAvailabilities } from "@modules/accounts/useCases/deleteProviderTimesAvailabilities/deleteProviderTimesAvailabilities.schema";
import { DeleteServiceProviderController } from "@modules/accounts/useCases/deleteServiceProvider/DeleteServiceProvider.controller";
import { schemaDeleteServiceProvider } from "@modules/accounts/useCases/deleteServiceProvider/deleteServiceProvider.schema";
import { GetAllLocalsProvidersController } from "@modules/accounts/useCases/getAllLocalsProvider/GetAllLocalsProvider.controller";
import { GetAllPaymentTypeController } from "@modules/accounts/useCases/getAllPaymentType/GetAllPaymentType.controller";
import { GetAllProvidersLocalsTypesController } from "@modules/accounts/useCases/getAllProviderLocalsTypes/GetAllProviderLocalsTypes.controller";
import { GetAvailabilitiesOptionsProviderWorkController } from "@modules/accounts/useCases/getAvailabilitiesOptionsProviderWork/GetAvailabilitiesOptionsProviderWork.controller";
import { GetUserProvidersController } from "@modules/accounts/useCases/getUserProviders/GetUserProviders.controller";
import { schemaGetUserProviders } from "@modules/accounts/useCases/getUserProviders/getUserProviders.schema";
import { MeProfileUserProviderController } from "@modules/accounts/useCases/meProfileUserProvider/MeProfileUserProvider.controller";
import { SetLocationCacheProvidersController } from "@modules/accounts/useCases/setLocationCacheProviders/SetLocationCacheProviders.controller";
import { schemaSetLocationCacheProviders } from "@modules/accounts/useCases/setLocationCacheProviders/setLocationCacheProviders.schema";
import { UpdatePaymentAccountPersonController } from "@modules/accounts/useCases/updatePaymentAccountPerson/UpdatePaymentAccountPerson.controller";
import { UpdatePhotosProviderController } from "@modules/accounts/useCases/updatePhotosProvider/UpdatePhotosProvider.controller";
import { UploadPhotosProviderController } from "@modules/accounts/useCases/uploadPhotosProvider/UploadPhotosUserProvider.controller";
import { VerifyPaymentAccountInfosController } from "@modules/accounts/useCases/verifyPaymentAccountInfos/VerifyPaymentAccountInfos.controller";
import { ConfirmAppointmentProviderController } from "@modules/appointments/useCases/confirmAppointmentProvider/ConfirmAppointmentProvider.controller";
import { schemaConfirmAppointmentProvider } from "@modules/appointments/useCases/confirmAppointmentProvider/confirmAppointmentProvider.schema";
import { RejectAppointmentProviderController } from "@modules/appointments/useCases/rejectAppointmentProvider/RejectAppointmentProvider.controller";
import { schemaRejectAppointmentProvider } from "@modules/appointments/useCases/rejectAppointmentProvider/rejectAppointmentProvider.schema";
import { ensureAuthenticated } from "@shared/infra/http/middlewares/ensureAuthenticated";
import { ensureAuthenticatedProvider } from "@shared/infra/http/middlewares/ensureAuthenticatedProvider";

const providersRoutes = Router();
const createUserProviderController = new CreateUserProviderController();
const createUsersTypeProvidersController =
  new CreateUsersTypeProvidersController();
const authenticateUserProviderController =
  new AuthenticateUserProviderController();
const meProfileUserProviderController = new MeProfileUserProviderController();
const createProviderTimesAvailabilitiesController =
  new CreateProviderTimesAvailabilitiesController();
const createProviderDaysAvailabilitiesController =
  new CreateProviderDaysAvailabilitiesController();
const getAvailabilitiesOptionsProviderWorkController =
  new GetAvailabilitiesOptionsProviderWorkController();
const createServiceProviderController = new CreateServiceProviderController();
const deleteServiceProviderController = new DeleteServiceProviderController();
const createProvidersPaymentsTypesController =
  new CreateProvidersPaymentsTypesController();
const createProviderTransportTypesAvailabilitiesController =
  new CreateProviderTransportTypesAvailabilitiesController();
const confirmAppointmentProviderController =
  new ConfirmAppointmentProviderController();
const rejectAppointmentProviderController =
  new RejectAppointmentProviderController();
const uploadPhotosProviderController = new UploadPhotosProviderController();
const updatePhotosProviderController = new UpdatePhotosProviderController();
const deletePhotosProviderController = new DeletePhotosProviderController();
const deleteProviderTimesAvailabilitiesController =
  new DeleteProviderTimesAvailabilitiesController();
const getAllLocalsController = new GetAllLocalsProvidersController();
const createLocalProviderController = new CreateLocalProviderController();
const deleteLocalsProviderController = new DeleteLocalsProviderController();
const getAllPaymentTypeController = new GetAllPaymentTypeController();
const updatePaymentAccountPersonController =
  new UpdatePaymentAccountPersonController();
const verifyPaymentAccountInfosController =
  new VerifyPaymentAccountInfosController();
const createProvidersLocalsTypesController =
  new CreateProvidersLocalsTypesController();
const getAllProvidersLocalsTypesController =
  new GetAllProvidersLocalsTypesController();
const deleteProvidersLocalsTypesController =
  new DeleteProvidersLocalsTypesController();
const setLocationCacheProvidersController =
  new SetLocationCacheProvidersController();
const getUserProvidersController = new GetUserProvidersController();
const changeUserTypeActiveUserProvidersController =
  new ChangeUserTypeActiveUserProvidersController();
const uploadImages = multer(uploadConfig);

providersRoutes.get(
  "/",
  schemaGetUserProviders,
  getUserProvidersController.handle
);

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

providersRoutes.patch(
  "/type/active",
  ensureAuthenticated,
  changeUserTypeActiveUserProvidersController.handle
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

providersRoutes.get(
  "/availabilities",
  ensureAuthenticatedProvider,
  getAvailabilitiesOptionsProviderWorkController.handle
);

providersRoutes.patch(
  "/hours",
  ensureAuthenticatedProvider,
  schemaCreateProviderTimesAvailabilities,
  createProviderTimesAvailabilitiesController.handle
);

providersRoutes.delete(
  "/hours",
  ensureAuthenticatedProvider,
  schemaDeleteProviderTimesAvailabilities,
  deleteProviderTimesAvailabilitiesController.handle
);

providersRoutes.post(
  "/services",
  ensureAuthenticatedProvider,
  schemaCreateServiceProvider,
  createServiceProviderController.handle
);

providersRoutes.delete(
  "/services",
  ensureAuthenticatedProvider,
  schemaDeleteServiceProvider,
  deleteServiceProviderController.handle
);

providersRoutes.patch(
  "/payments_types",
  ensureAuthenticatedProvider,
  schemaCreateProvidersPaymentsTypes,
  createProvidersPaymentsTypesController.handle
);

providersRoutes.patch(
  "/transports/types",
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

providersRoutes.post(
  "/photos",
  ensureAuthenticatedProvider,
  uploadImages.array("photos", 5),
  uploadPhotosProviderController.handle
);

providersRoutes.patch(
  "/photos/positions",
  ensureAuthenticatedProvider,
  updatePhotosProviderController.handle
);

providersRoutes.delete(
  "/photos",
  ensureAuthenticatedProvider,
  deletePhotosProviderController.handle
);

providersRoutes.get(
  "/payments_types",
  ensureAuthenticatedProvider,
  getAllPaymentTypeController.handle
);

providersRoutes.post(
  "/locals/types",
  ensureAuthenticatedProvider,
  schemaCreateProvidersLocalsTypes,
  createProvidersLocalsTypesController.handle
);

providersRoutes.get(
  "/locals/types",
  ensureAuthenticatedProvider,
  getAllProvidersLocalsTypesController.handle
);

providersRoutes.delete(
  "/locals/types",
  ensureAuthenticatedProvider,
  schemaDeleteLocalsTypesProviders,
  deleteProvidersLocalsTypesController.handle
);

providersRoutes.post(
  "/locals",
  ensureAuthenticatedProvider,
  schemaCreateLocalProviders,
  createLocalProviderController.handle
);

providersRoutes.get(
  "/locals",
  ensureAuthenticatedProvider,
  getAllLocalsController.handle
);

providersRoutes.delete(
  "/locals",
  ensureAuthenticatedProvider,
  schemaDeleteLocalsProviders,
  deleteLocalsProviderController.handle
);

providersRoutes.put(
  "/update/payment/person",
  ensureAuthenticatedProvider,
  updatePaymentAccountPersonController.handle
);

providersRoutes.get(
  "/verify/payment/infos",
  ensureAuthenticatedProvider,
  verifyPaymentAccountInfosController.handle
);

providersRoutes.post(
  "/geolocation",
  ensureAuthenticatedProvider,
  schemaSetLocationCacheProviders,
  setLocationCacheProvidersController.handle
);

export { providersRoutes };
