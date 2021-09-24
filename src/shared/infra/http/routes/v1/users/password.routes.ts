import { CelebrateError } from "celebrate";
import { Router } from "express";

import { ResetPasswordUserController } from "@modules/accounts/useCases/resetPasswordUser/ResetPasswordUser.controller";
import { schemaResetPassword } from "@modules/accounts/useCases/resetPasswordUser/resetPasswordUser.schema";
import { SendForgotPasswordMailController } from "@modules/accounts/useCases/sendForgotPasswordMail/SendForgotPasswordMail.controller";
import { schemaSendForgotPassword } from "@modules/accounts/useCases/sendForgotPasswordMail/sendForgotPasswordMail.schema";
import { SendForgotPasswordPhoneController } from "@modules/accounts/useCases/sendForgotPasswordPhone/SendForgotPasswordPhone.controller";
import { schemaSendForgotPasswordPhone } from "@modules/accounts/useCases/sendForgotPasswordPhone/sendForgotPasswordPhone.schema";

const passwordRoutes = Router();

const sendForgotPasswordMailController = new SendForgotPasswordMailController();
const resetPasswordUserController = new ResetPasswordUserController();
const sendForgotPasswordPhoneController = new SendForgotPasswordPhoneController();

passwordRoutes.post(
  "/forgot/mail",
  schemaSendForgotPassword,
  sendForgotPasswordMailController.handle
);

passwordRoutes.post(
  "/forgot/phone",
  schemaSendForgotPasswordPhone,
  sendForgotPasswordPhoneController.handle
);

passwordRoutes.post(
  "/reset",
  schemaResetPassword,
  resetPasswordUserController.handle
);

export { passwordRoutes };
