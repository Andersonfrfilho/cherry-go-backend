import { Response, Request } from "express";
import { container } from "tsyringe";

import { ResendConfirmationMailUserMailService } from "@modules/accounts/useCases/resendConfirmationMailUserMail/ResendConfirmationMailUserMail.service";
import { HTTP_STATUS_CODE_SUCCESS_ENUM } from "@shared/infra/http/enums";

export class ResendConfirmationMailUserMailController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { email } = request.body;

    const resendConfirmationMailUserService = container.resolve(
      ResendConfirmationMailUserMailService
    );

    await resendConfirmationMailUserService.execute(email);

    return response.status(HTTP_STATUS_CODE_SUCCESS_ENUM.NO_CONTENT).send();
  }
}
