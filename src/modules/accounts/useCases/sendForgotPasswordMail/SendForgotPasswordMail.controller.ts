import { Response, Request } from "express";
import { container } from "tsyringe";

import { SendForgotPasswordMailService } from "@modules/accounts/useCases/sendForgotPasswordMail/SendForgotPasswordMail.service";

class SendForgotPasswordMailController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { email } = request.body;
    const sendoForgotPasswordMailService = container.resolve(
      SendForgotPasswordMailService
    );

    await sendoForgotPasswordMailService.execute(email);

    return response.status(204).send();
  }
}
export { SendForgotPasswordMailController };
