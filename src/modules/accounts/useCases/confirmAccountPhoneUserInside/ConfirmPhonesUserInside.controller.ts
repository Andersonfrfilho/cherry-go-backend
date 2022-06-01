import { Response, Request } from "express";
import { container } from "tsyringe";

import { ConfirmPhonesUserInsideService } from "@modules/accounts/useCases/confirmAccountPhoneUserInside/ConfirmPhonesUserInside.service";
import { HTTP_STATUS_CODE_SUCCESS_ENUM } from "@shared/infra/http/enums";

export class ConfirmPhonesUserInsideController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { code, token, user_id } = request.body;
    const confirmAccountPhoneUserInsideService = container.resolve(
      ConfirmPhonesUserInsideService
    );
    await confirmAccountPhoneUserInsideService.execute({
      token,
      code,
      user_id,
    });

    return response.status(HTTP_STATUS_CODE_SUCCESS_ENUM.NO_CONTENT).send();
  }
}
