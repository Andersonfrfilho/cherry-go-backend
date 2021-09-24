import { Response, Request } from "express";
import { container } from "tsyringe";

import { SendForgotPasswordMailService } from "@modules/accounts/useCases/sendForgotPasswordMail/SendForgotPasswordMail.service";
import { HTTP_STATUS_CODE_SUCCESS_ENUM } from "@shared/infra/http/enums";

class SendForgotPasswordMailController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { email } = request.body;

    const sendoForgotPasswordMailService = container.resolve(
      SendForgotPasswordMailService
    );

    await sendoForgotPasswordMailService.execute({ email });

    return response.status(HTTP_STATUS_CODE_SUCCESS_ENUM.NO_CONTENT).send();
  }
}
export { SendForgotPasswordMailController };
