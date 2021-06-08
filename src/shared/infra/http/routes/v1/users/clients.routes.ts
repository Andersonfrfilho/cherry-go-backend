import { Router } from "express";

import { CreateUserAddressClientController } from "@modules/accounts/useCases/createAddressUserClient/CreateUserAddressClient.controller";
import { schemaCreateUserAddressClient } from "@modules/accounts/useCases/createAddressUserClient/createUserAddressClient.schema";
import { schemaCreateUserPhoneClient } from "@modules/accounts/useCases/createPhonesUserClient/createUserPhoneClient.schema";
import { CreateUserPhoneClientController } from "@modules/accounts/useCases/createPhonesUserClient/CreateUserPhonesClient.controller";
import { CreateTagsUsersController } from "@modules/accounts/useCases/createTagsUsersClient/createTagsUsersClient.controller";
import { schemaCreateTagsUsersClient } from "@modules/accounts/useCases/createTagsUsersClient/createTagsUsersClient.schema";
import { CreateUserClientController } from "@modules/accounts/useCases/createUserClient/CreateUserClient.controller";
import { schemaCreateUserClient } from "@modules/accounts/useCases/createUserClient/createUserClient.schema";
import { ensureAuthenticated } from "@shared/infra/http/middlewares/ensureAuthenticated";

const clientsRoutes = Router();
const createUserClientController = new CreateUserClientController();
const createUserAddressClientController = new CreateUserAddressClientController();
const createUserPhoneClientController = new CreateUserPhoneClientController();
const createTagsUsersController = new CreateTagsUsersController();

clientsRoutes.post(
  "/",
  schemaCreateUserClient,
  createUserClientController.handle
);

clientsRoutes.patch(
  "/addresses",
  ensureAuthenticated,
  schemaCreateUserAddressClient,
  createUserAddressClientController.handle
);

clientsRoutes.patch(
  "/phones",
  ensureAuthenticated,
  schemaCreateUserPhoneClient,
  createUserPhoneClientController.handle
);
clientsRoutes.patch(
  "/tags",
  ensureAuthenticated,
  schemaCreateTagsUsersClient,
  createTagsUsersController.handle
);

export { clientsRoutes };
