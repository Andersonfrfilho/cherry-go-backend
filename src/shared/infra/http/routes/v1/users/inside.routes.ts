import { Router } from "express";

import { CreateUserInsideController } from "@modules/accounts/useCases/createUserInside/CreateUserInside.controller";
import { schemaCreateUserInside } from "@modules/accounts/useCases/createUserInside/createUserInside.schema";
import { CreateUsersTypeInsideController } from "@modules/accounts/useCases/createUsersTypeInside/CreateUsersTypeInside.controller";
import { schemaUsersTypeInsideUser } from "@modules/accounts/useCases/createUsersTypeInside/createUsersTypeInside.schema";
import { ensureAuthenticatedAdmin } from "@shared/infra/http/middlewares/ensureAuthenticatedAdmin";

const insidesRoutes = Router();
const createUsersTypeInsideController = new CreateUsersTypeInsideController();
const createUserInsideController = new CreateUserInsideController();

insidesRoutes.post(
  "/",
  schemaCreateUserInside,
  createUserInsideController.handle
);

insidesRoutes.patch(
  "/",
  schemaUsersTypeInsideUser,
  createUsersTypeInsideController.handle
);

export { insidesRoutes };
