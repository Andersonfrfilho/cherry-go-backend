import { Router } from "express";

import { ConfirmAccountMailUserController } from "@modules/accounts/useCases/confirmAccountMailUser/ConfirmAccountMailUser.controller";
import { schemaConfirmAccountMailUser } from "@modules/accounts/useCases/confirmAccountMailUser/confirmAccountMailUser.schema";

const confirmsRoutes = Router();
const confirmAccountMailUserController = new ConfirmAccountMailUserController();

confirmsRoutes.patch(
  "/mail",
  schemaConfirmAccountMailUser,
  confirmAccountMailUserController.handle
);

export { confirmsRoutes };
