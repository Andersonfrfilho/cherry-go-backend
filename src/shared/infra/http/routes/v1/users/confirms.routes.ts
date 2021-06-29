import { Router } from "express";

import { ConfirmAccountMailUserController } from "@modules/accounts/useCases/confirmAccountMailUser/ConfirmAccountMailUser.controller";
import { schemaConfirmAccountMailUser } from "@modules/accounts/useCases/confirmAccountMailUser/confirmAccountMailUser.schema";
import { ConfirmAccountPhoneUserController } from "@modules/accounts/useCases/confirmAccountPhoneUser/ConfirmAccountPhoneUser.controller";
import { schemaConfirmAccountPhoneUser } from "@modules/accounts/useCases/confirmAccountPhoneUser/confirmAccountPhoneUser.schema";
import { TermsAcceptUserController } from "@modules/accounts/useCases/termsAcceptsUser/TermsAcceptsUser.controller";
import { schemaAcceptUser } from "@modules/accounts/useCases/termsAcceptsUser/termsAcceptsUser.schema";
import { ensureAuthenticated } from "@shared/infra/http/middlewares/ensureAuthenticated";

const confirmsRoutes = Router();
const confirmAccountMailUserController = new ConfirmAccountMailUserController();
const confirmAccountPhoneUserController = new ConfirmAccountPhoneUserController();
const termsAcceptUserController = new TermsAcceptUserController();

confirmsRoutes.get(
  "/mail",
  schemaConfirmAccountMailUser,
  confirmAccountMailUserController.handle
);

confirmsRoutes.patch(
  "/phone",
  ensureAuthenticated,
  schemaConfirmAccountPhoneUser,
  confirmAccountPhoneUserController.handle
);

confirmsRoutes.post(
  "/term",
  ensureAuthenticated,
  schemaAcceptUser,
  termsAcceptUserController.handle
);

export { confirmsRoutes };
