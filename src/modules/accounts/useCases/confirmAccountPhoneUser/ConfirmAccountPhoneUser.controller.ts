import { Response, Request } from "express";
import { container } from "tsyringe";

import { ConfirmAccountPhoneUserService } from "@modules/accounts/useCases/confirmAccountPhoneUser/ConfirmAccountPhoneUser.service";
import { HttpSuccessCodeEnum } from "@shared/infra/http/enums";

class ConfirmAccountPhoneUserController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { id } = request.user;
    const { code, token } = request.body;
    const confirmAccountPhoneUserService = container.resolve(
      ConfirmAccountPhoneUserService
    );

    await confirmAccountPhoneUserService.execute({ token, code, user_id: id });

    return response.status(HttpSuccessCodeEnum.NO_CONTENT).send();
  }
}
export { ConfirmAccountPhoneUserController };
