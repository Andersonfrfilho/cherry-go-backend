import { Router } from "express";

import { CreateUserAddressClientController } from "@modules/accounts/useCases/createAddressUserClient/CreateUserAddressClient.controller";
import { schemaCreateUserAddressClient } from "@modules/accounts/useCases/createAddressUserClient/CreateUserAddressClient.schema";
import { CreateUserClientController } from "@modules/accounts/useCases/createUserClient/CreateUserClient.controller";
import { schemaCreateUserClient } from "@modules/accounts/useCases/createUserClient/CreateUserClient.schema";
import { ensureAuthenticated } from "@shared/infra/http/middlewares/ensureAuthenticated";

const clientsRoutes = Router();
const createUserClientController = new CreateUserClientController();
const createUserAddressClientController = new CreateUserAddressClientController();

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

export { clientsRoutes };
