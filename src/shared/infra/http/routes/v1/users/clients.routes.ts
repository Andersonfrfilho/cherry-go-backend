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
import { ResendPhonesUserClientController } from "@modules/accounts/useCases/resendPhoneCodeUserClient/ResendPhonesUserClient.controller";
import { schemaResendPhoneCodeUserClient } from "@modules/accounts/useCases/resendPhoneCodeUserClient/resendPhonesUserClient.schema";
import { ensureAuthenticatedInside } from "@shared/infra/http/middlewares/ensureAuthenticatedInside";

const clientsRoutes = Router();
const createUserClientController = new CreateUserClientController();
const resendPhonesUserClientController = new ResendPhonesUserClientController();
const createUserAddressClientController = new CreateUserAddressClientController();
const createUserPhoneClientController = new CreateUserPhoneClientController();
const createTagsUsersController = new CreateTagsUsersController();
const activeUserClientController = new ActiveUserClientController();

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

export { clientsRoutes };
