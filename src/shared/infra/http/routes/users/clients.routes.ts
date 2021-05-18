import { Router } from "express";

import { CreateUserClientController } from "@modules/accounts/useCases/createUserClient/CreateUserClient.controller";
import { schemaCreateUserClient } from "@modules/accounts/useCases/createUserClient/CreateUserClient.schema";

const clientsRoutes = Router();
const createUserClientController = new CreateUserClientController();

clientsRoutes.post(
  "/",
  schemaCreateUserClient,
  createUserClientController.handle
);

export { clientsRoutes };
