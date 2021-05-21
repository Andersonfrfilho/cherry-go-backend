import { Router } from "express";

import { AuthenticatedUserController } from "@modules/accounts/useCases/authenticateUser/AuthenticateUser.controller";
import { RefreshTokenController } from "@modules/accounts/useCases/refreshToken/RefreshToken.controller";

const authenticateUsersRoutes = Router();

const createSpecificationController = new AuthenticatedUserController();
const refreshTokenController = new RefreshTokenController();

authenticateUsersRoutes.post(
  "/users/sessions",
  createSpecificationController.handle
);
authenticateUsersRoutes.post("/refresh-token", refreshTokenController.handle);

export { authenticateUsersRoutes };
