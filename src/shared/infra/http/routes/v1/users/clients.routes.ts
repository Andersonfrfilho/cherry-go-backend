import { Router } from "express";

import { ActiveUserClientController } from "@modules/accounts/useCases/activeAccount/ActiveAccount.controller";
import { schemaActiveUser } from "@modules/accounts/useCases/activeAccount/activeAccount.schema";
import { CreateUserAddressClientController } from "@modules/accounts/useCases/createAddressUserClient/CreateUserAddressClient.controller";
import { schemaCreateUserAddressClient } from "@modules/accounts/useCases/createAddressUserClient/createUserAddressClient.schema";
import { CreateAppointmentPaymentCardController } from "@modules/accounts/useCases/createAppointmentPaymentCard/CreateAppointmentPaymentCard.controller";
import { schemaCreateUserPhoneClient } from "@modules/accounts/useCases/createPhonesUserClient/createUserPhoneClient.schema";
import { CreateUserPhoneClientController } from "@modules/accounts/useCases/createPhonesUserClient/CreateUserPhonesClient.controller";
import { CreateTagsUsersController } from "@modules/accounts/useCases/createTagsUsersClient/CreateTagsUsersClient.controller";
import { schemaCreateTagsUsersClient } from "@modules/accounts/useCases/createTagsUsersClient/createTagsUsersClient.schema";
import { CreateUserClientController } from "@modules/accounts/useCases/createUserClient/CreateUserClient.controller";
import { schemaCreateUserClient } from "@modules/accounts/useCases/createUserClient/createUserClient.schema";
import { GetAllHoursAvailableProviderController } from "@modules/accounts/useCases/getAllHoursAvailableProvider/GetAllHoursAvailableProvider.controller";
import { schemaGetAllHoursAvailableProvider } from "@modules/accounts/useCases/getAllHoursAvailableProvider/getAllHoursAvailableProvider.schema";
import { GetDistanceByLocalsController } from "@modules/accounts/useCases/getDistanceByLocals/GetDistanceByLocals.controller";
import { schemaGetDistanceByLocals } from "@modules/accounts/useCases/getDistanceByLocals/getDistanceByLocals.schema";
import { GetProvidersController } from "@modules/accounts/useCases/getProviders/GetProviders.controller";
import { GetStageAppointmentClientController } from "@modules/accounts/useCases/getStageAppointmentClient/GetStageAppointmentClient.controller";
import { InvalidateStageAppointmentClientController } from "@modules/accounts/useCases/invalidateStageAppointmentClient/InvalidateStageAppointmentClient.controller";
import { RatingProvidersController } from "@modules/accounts/useCases/ratingProviders/RatingProviders.controller";
import { schemaRatingProviders } from "@modules/accounts/useCases/ratingProviders/ratingProviders.schema";
import { ResendPhonesUserClientController } from "@modules/accounts/useCases/resendPhoneCodeUserClient/ResendPhonesUserClient.controller";
import { schemaResendPhoneCodeUserClient } from "@modules/accounts/useCases/resendPhoneCodeUserClient/resendPhonesUserClient.schema";
import { SetProvidersFavoriteController } from "@modules/accounts/useCases/setProvidersFavorite/SetProvidersFavorite.controller";
import { schemaSetProvidersFavorite } from "@modules/accounts/useCases/setProvidersFavorite/setProvidersFavorite.schema";
import { SetStageAppointmentClientController } from "@modules/accounts/useCases/setStageAppointmentClient/SetStageAppointmentClient.controller";
import { TesteController } from "@modules/accounts/useCases/teste/Teste.controller";
import { UpdateUserDetailsController } from "@modules/accounts/useCases/updateUserDetails/UpdateUserDetails.controller";
import { schemaUpdateUserDetails } from "@modules/accounts/useCases/updateUserDetails/updateUserDetails.schema";
import { ensureAuthenticated } from "@shared/infra/http/middlewares/ensureAuthenticated";
import { ensureAuthenticatedInside } from "@shared/infra/http/middlewares/ensureAuthenticatedInside";

const clientsRoutes = Router();
const createUserClientController = new CreateUserClientController();
const updateUserDetailsController = new UpdateUserDetailsController();
const resendPhonesUserClientController = new ResendPhonesUserClientController();
const createUserAddressClientController =
  new CreateUserAddressClientController();
const createUserPhoneClientController = new CreateUserPhoneClientController();
const createTagsUsersController = new CreateTagsUsersController();
const activeUserClientController = new ActiveUserClientController();
const getProvidersController = new GetProvidersController();
const ratingProvidersController = new RatingProvidersController();
const setProvidersFavoriteController = new SetProvidersFavoriteController();
const setStageAppointmentClientController =
  new SetStageAppointmentClientController();
const invalidateStageAppointmentClientController =
  new InvalidateStageAppointmentClientController();
const getStageAppointmentClientController =
  new GetStageAppointmentClientController();
const getAllHoursAvailableProviderController =
  new GetAllHoursAvailableProviderController();
const getDistanceByLocalsController = new GetDistanceByLocalsController();
const createAppointmentPaymentCardController =
  new CreateAppointmentPaymentCardController();
const testeController = new TesteController();

clientsRoutes.post(
  "/",
  schemaCreateUserClient,
  createUserClientController.handle
);

clientsRoutes.post(
  "/addresses",
  schemaCreateUserAddressClient,
  createUserAddressClientController.handle
);

clientsRoutes.post(
  "/phones",
  schemaCreateUserPhoneClient,
  createUserPhoneClientController.handle
);

clientsRoutes.post(
  "/phones/resend/code",
  schemaResendPhoneCodeUserClient,
  resendPhonesUserClientController.handle
);

clientsRoutes.patch(
  "/active",
  ensureAuthenticatedInside,
  schemaActiveUser,
  activeUserClientController.handle
);

clientsRoutes.post(
  "/tags",
  schemaCreateTagsUsersClient,
  createTagsUsersController.handle
);

clientsRoutes.put(
  "/details",
  ensureAuthenticated,
  schemaUpdateUserDetails,
  updateUserDetailsController.handle
);

clientsRoutes.get(
  "/providers/available",
  ensureAuthenticated,
  // schemaGetProviders,
  getProvidersController.handle
);

clientsRoutes.post(
  "/providers/rating",
  ensureAuthenticated,
  schemaRatingProviders,
  ratingProvidersController.handle
);

clientsRoutes.post(
  "/providers/favorite",
  ensureAuthenticated,
  schemaSetProvidersFavorite,
  setProvidersFavoriteController.handle
);

clientsRoutes.post(
  "/appointment/stage",
  ensureAuthenticated,
  setStageAppointmentClientController.handle
);

clientsRoutes.post(
  "/appointment/payment/cards",
  ensureAuthenticated,
  createAppointmentPaymentCardController.handle
);

clientsRoutes.delete(
  "/appointment/stage",
  ensureAuthenticated,
  invalidateStageAppointmentClientController.handle
);

clientsRoutes.get(
  "/appointment/stage",
  ensureAuthenticated,
  getStageAppointmentClientController.handle
);

clientsRoutes.get(
  "/provider/available/hours",
  ensureAuthenticated,
  schemaGetAllHoursAvailableProvider,
  getAllHoursAvailableProviderController.handle
);

clientsRoutes.post(
  "/provider/locals/types/distances",
  ensureAuthenticated,
  schemaGetDistanceByLocals,
  getDistanceByLocalsController.handle
);

clientsRoutes.get("/test", testeController.handle);

export { clientsRoutes };
