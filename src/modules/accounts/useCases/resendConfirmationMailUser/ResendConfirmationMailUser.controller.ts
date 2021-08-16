import { Response, Request } from "express";
import { container } from "tsyringe";

import { ResendConfirmationMailUserService } from "@modules/accounts/useCases/resendConfirmationMailUser/ResendConfirmationMailUser.service";
import { HTTP_STATUS_CODE_SUCCESS_ENUM } from "@shared/infra/http/enums";

export class ResendConfirmationMailUserController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { token } = request.body;

    const resendConfirmationMailUserService = container.resolve(
      ResendConfirmationMailUserService
    );

    await resendConfirmationMailUserService.execute(token);

    return response.status(HTTP_STATUS_CODE_SUCCESS_ENUM.NO_CONTENT).send();
  }
}
