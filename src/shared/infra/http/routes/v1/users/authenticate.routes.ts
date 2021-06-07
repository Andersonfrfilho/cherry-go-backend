import { Router } from "express";

import { AuthenticatedUserController } from "@modules/accounts/useCases/authenticateUser/AuthenticateUser.controller";
import { schemaAuthenticate } from "@modules/accounts/useCases/authenticateUser/authenticateUser.schema";
import { RefreshTokenController } from "@modules/accounts/useCases/refreshToken/RefreshToken.controller";
import { schemaRefreshToken } from "@modules/accounts/useCases/refreshToken/refreshToken.schema";

const authenticateUsersRoutes = Router();

const createSpecificationController = new AuthenticatedUserController();
const refreshTokenController = new RefreshTokenController();

authenticateUsersRoutes.post(
  "/sessions",
  schemaAuthenticate,
  createSpecificationController.handle
);

authenticateUsersRoutes.post(
  "/refresh_token",
  schemaRefreshToken,
  refreshTokenController.handle
);

export { authenticateUsersRoutes };