import { Router } from "express";

import { AuthenticatedUserController } from "@modules/accounts/useCases/authenticateUser/AuthenticateUser.controller";
import { schemaAuthenticate } from "@modules/accounts/useCases/authenticateUser/authenticateUser.schema";
import { MeUserProfileController } from "@modules/accounts/useCases/meUserProfile/MeUserProfile.controller";
import { RefreshTokenController } from "@modules/accounts/useCases/refreshToken/RefreshToken.controller";
import { schemaRefreshToken } from "@modules/accounts/useCases/refreshToken/refreshToken.schema";
import { ensureAuthenticated } from "@shared/infra/http/middlewares/ensureAuthenticated";

const authenticateUsersRoutes = Router();

const authenticatedUserController = new AuthenticatedUserController();
const refreshTokenController = new RefreshTokenController();
const meUserProfileController = new MeUserProfileController();

authenticateUsersRoutes.post(
  "/sessions",
  schemaAuthenticate,
  authenticatedUserController.handle
);

authenticateUsersRoutes.post(
  "/refresh_token",
  schemaRefreshToken,
  refreshTokenController.handle
);

authenticateUsersRoutes.get(
  "/me",
  ensureAuthenticated,
  meUserProfileController.handle
);

export { authenticateUsersRoutes };
