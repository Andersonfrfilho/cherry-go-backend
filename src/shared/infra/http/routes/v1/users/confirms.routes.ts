import { Router } from "express";

import { ConfirmAccountMailUserController } from "@modules/accounts/useCases/confirmAccountMailUser/ConfirmAccountMailUser.controller";
import { schemaConfirmAccountMailUser } from "@modules/accounts/useCases/confirmAccountMailUser/confirmAccountMailUser.schema";
import { ConfirmAccountPhoneUserController } from "@modules/accounts/useCases/confirmAccountPhoneUser/ConfirmAccountPhoneUser.controller";
import { schemaConfirmAccountPhoneUser } from "@modules/accounts/useCases/confirmAccountPhoneUser/confirmAccountPhoneUser.schema";
import { ResendConfirmationMailUserController } from "@modules/accounts/useCases/resendConfirmationMailUser/ResendConfirmationMailUser.controller";
import { schemaResendConfirmationMailUser } from "@modules/accounts/useCases/resendConfirmationMailUser/resendConfirmationMailUser.schema";
import { ResendConfirmationMailUserMailController } from "@modules/accounts/useCases/resendConfirmationMailUserMail/ResendConfirmationMailUserMail.controller";
import { schemaResendConfirmationMailUserMailService } from "@modules/accounts/useCases/resendConfirmationMailUserMail/resendConfirmationMailUserMail.schema";
import { TermsAcceptUserController } from "@modules/accounts/useCases/termsAcceptsUser/TermsAcceptsUser.controller";
import { schemaAcceptUser } from "@modules/accounts/useCases/termsAcceptsUser/termsAcceptsUser.schema";
import { ensureAuthenticated } from "@shared/infra/http/middlewares/ensureAuthenticated";

const confirmsRoutes = Router();
const confirmAccountMailUserController = new ConfirmAccountMailUserController();
const confirmAccountPhoneUserController = new ConfirmAccountPhoneUserController();
const resendConfirmationMailUserController = new ResendConfirmationMailUserController();
const resendConfirmationMailUserMailController = new ResendConfirmationMailUserMailController();
const termsAcceptUserController = new TermsAcceptUserController();

confirmsRoutes.get(
  "/mail",
  schemaConfirmAccountMailUser,
  confirmAccountMailUserController.handle
);

confirmsRoutes.post(
  "/mail/resend",
  schemaResendConfirmationMailUser,
  resendConfirmationMailUserController.handle
);

confirmsRoutes.post(
  "/mail/resend/mail",
  schemaResendConfirmationMailUserMailService,
  resendConfirmationMailUserMailController.handle
);

confirmsRoutes.post(
  "/phone",
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
