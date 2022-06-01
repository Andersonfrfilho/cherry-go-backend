import { Response, Request } from "express";
import { container } from "tsyringe";

import { ConfirmAccountPhoneUserService } from "@modules/accounts/useCases/confirmAccountPhoneUser/ConfirmAccountPhoneUser.service";
import { HTTP_STATUS_CODE_SUCCESS_ENUM } from "@shared/infra/http/enums";

class ConfirmAccountPhoneUserController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { code, token, user_id } = request.body;
    const confirmAccountPhoneUserService = container.resolve(
      ConfirmAccountPhoneUserService
    );
    await confirmAccountPhoneUserService.execute({ token, code, user_id });
    return response.status(HTTP_STATUS_CODE_SUCCESS_ENUM.NO_CONTENT).send();
  }
}
export { ConfirmAccountPhoneUserController };
