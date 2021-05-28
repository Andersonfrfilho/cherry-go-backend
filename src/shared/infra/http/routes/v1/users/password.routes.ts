import { Router } from "express";

import { ResetPasswordUserController } from "@modules/accounts/useCases/resetPasswordUser/ResetPasswordUser.controller";
import { schemaResetPassword } from "@modules/accounts/useCases/resetPasswordUser/resetPasswordUser.schema";
import { SendForgotPasswordMailController } from "@modules/accounts/useCases/sendForgotPasswordMail/SendForgotPasswordMail.controller";
import { schemaSendForgotPassword } from "@modules/accounts/useCases/sendForgotPasswordMail/sendForgotPasswordMail.schema";

const passwordRoutes = Router();

const sendForgotPasswordMailController = new SendForgotPasswordMailController();
const resetPasswordUserController = new ResetPasswordUserController();

passwordRoutes.post(
  "/forgot",
  schemaSendForgotPassword,
  sendForgotPasswordMailController.handle
);
passwordRoutes.post(
  "/reset",
  schemaResetPassword,
  resetPasswordUserController.handle
);

export { passwordRoutes };
