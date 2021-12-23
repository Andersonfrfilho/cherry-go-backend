import { Router } from "express";

import { ActiveUserClientController } from "@modules/accounts/useCases/activeAccount/ActiveAccount.controller";
import { schemaActiveUser } from "@modules/accounts/useCases/activeAccount/activeAccount.schema";
import { CreateUserAddressClientController } from "@modules/accounts/useCases/createAddressUserClient/CreateUserAddressClient.controller";
import { schemaCreateUserAddressClient } from "@modules/accounts/useCases/createAddressUserClient/createUserAddressClient.schema";
import { schemaCreateUserPhoneClient } from "@modules/accounts/useCases/createPhonesUserClient/createUserPhoneClient.schema";
import { CreateUserPhoneClientController } from "@modules/accounts/useCases/createPhonesUserClient/CreateUserPhonesClient.controller";
import { CreateTagsUsersController } from "@modules/accounts/useCases/createTagsUsersClient/CreateTagsUsersClient.controller";
import { schemaCreateTagsUsersClient } from "@modules/accounts/useCases/createTagsUsersClient/createTagsUsersClient.schema";
import { CreateUserClientController } from "@modules/accounts/useCases/createUserClient/CreateUserClient.controller";
import { schemaCreateUserClient } from "@modules/accounts/useCases/createUserClient/createUserClient.schema";
import { GetProvidersController } from "@modules/accounts/useCases/getProviders/GetProviders.controller";
import { schemaGetProviders } from "@modules/accounts/useCases/getProviders/getProviders.schema";
import { RatingProvidersController } from "@modules/accounts/useCases/ratingProviders/RatingProviders.controller";
import { schemaRatingProviders } from "@modules/accounts/useCases/ratingProviders/ratingProviders.schema";
import { ResendPhonesUserClientController } from "@modules/accounts/useCases/resendPhoneCodeUserClient/ResendPhonesUserClient.controller";
import { schemaResendPhoneCodeUserClient } from "@modules/accounts/useCases/resendPhoneCodeUserClient/resendPhonesUserClient.schema";
import { SetProvidersFavoriteController } from "@modules/accounts/useCases/setProvidersFavorite/SetProvidersFavorite.controller";
import { schemaSetProvidersFavorite } from "@modules/accounts/useCases/setProvidersFavorite/setProvidersFavorite.schema";
import { UpdateUserDetailsController } from "@modules/accounts/useCases/updateUserDetails/UpdateUserDetails.controller";
import { schemaUpdateUserDetails } from "@modules/accounts/useCases/updateUserDetails/updateUserDetails.schema";
import { ensureAuthenticated } from "@shared/infra/http/middlewares/ensureAuthenticated";
import { ensureAuthenticatedInside } from "@shared/infra/http/middlewares/ensureAuthenticatedInside";

const clientsRoutes = Router();
const createUserClientController = new CreateUserClientController();
const updateUserDetailsController = new UpdateUserDetailsController();
const resendPhonesUserClientController = new ResendPhonesUserClientController();
const createUserAddressClientController = new CreateUserAddressClientController();
const createUserPhoneClientController = new CreateUserPhoneClientController();
const createTagsUsersController = new CreateTagsUsersController();
const activeUserClientController = new ActiveUserClientController();
const getProvidersController = new GetProvidersController();
const ratingProvidersController = new RatingProvidersController();
const setProvidersFavoriteController = new SetProvidersFavoriteController();

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

export { clientsRoutes };
