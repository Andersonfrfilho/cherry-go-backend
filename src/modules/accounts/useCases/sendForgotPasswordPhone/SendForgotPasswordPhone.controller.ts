import { Response, Request } from "express";
import { container } from "tsyringe";

import { SendForgotPasswordPhoneService } from "@modules/accounts/useCases/sendForgotPasswordPhone/SendForgotPasswordPhone.service";
import { HTTP_STATUS_CODE_SUCCESS_ENUM } from "@shared/infra/http/enums";

export class SendForgotPasswordPhoneController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { country_code, ddd, number } = request.body;

    const sendForgotPasswordPhoneService = container.resolve(
      SendForgotPasswordPhoneService
    );

    const send_forgot_password = await sendForgotPasswordPhoneService.execute({
      country_code,
      ddd,
      number,
    });
    return response.json(send_forgot_password);
  }
}
