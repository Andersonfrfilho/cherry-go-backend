import { Router } from "express";

import { ResetPasswordUserController } from "@modules/accounts/useCases/resetPasswordUser/ResetPasswordUser.controller";
import { schemaResetPassword } from "@modules/accounts/useCases/resetPasswordUser/ResetPasswordUser.schema";
// import { SendForgotPasswordMailController } from "@modules/accounts/useCases/sendForgotPasswordMail/SendForgotPasswordMailController";

const passwordRoutes = Router();

// const sendForgotPasswordMailController = new SendForgotPasswordMailController();
const resetPasswordUserController = new ResetPasswordUserController();

// passwordRoutes.post("/forgot", sendForgotPasswordMailController.handle);
passwordRoutes.post(
  "/reset",
  schemaResetPassword,
  resetPasswordUserController.handle
);

export { passwordRoutes };
