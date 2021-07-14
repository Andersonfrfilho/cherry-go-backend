import { Router } from "express";

import { CreateUsersTypeInsideController } from "@modules/accounts/useCases/createUsersTypeInside/CreateUsersTypeInside.controller";
import { ensureAuthenticatedAdmin } from "@shared/infra/http/middlewares/ensureAuthenticatedAdmin";

const insideRoutes = Router();
const createUsersTypeInsideController = new CreateUsersTypeInsideController();

insideRoutes.patch(
  "/",
  ensureAuthenticatedAdmin,
  createUsersTypeInsideController.handle
);

export { insideRoutes };
