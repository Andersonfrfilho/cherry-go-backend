import { Router } from "express";

import { CreateUsersTypeInsideController } from "@modules/accounts/useCases/createUsersTypeInside/CreateUsersTypeInside.controller";
import { schemaUsersTypeInsideUser } from "@modules/accounts/useCases/createUsersTypeInside/createUsersTypeInside.schema";
import { ensureAuthenticatedAdmin } from "@shared/infra/http/middlewares/ensureAuthenticatedAdmin";

const insidesRoutes = Router();
const createUsersTypeInsideController = new CreateUsersTypeInsideController();

insidesRoutes.patch(
  "/",
  ensureAuthenticatedAdmin,
  schemaUsersTypeInsideUser,
  createUsersTypeInsideController.handle
);

export { insidesRoutes };
