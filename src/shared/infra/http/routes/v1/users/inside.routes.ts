import { Router } from "express";

import { CreateUsersTypeInsideController } from "@modules/accounts/useCases/createUsersTypeInside/CreateUsersTypeInside.controller";
import { ensureAuthenticatedAdmin } from "@shared/infra/http/middlewares/ensureAuthenticatedAdmin";

const insidesRoutes = Router();
const createUsersTypeInsideController = new CreateUsersTypeInsideController();

insidesRoutes.patch(
  "/",
  ensureAuthenticatedAdmin,
  createUsersTypeInsideController.handle
);

export { insidesRoutes };
