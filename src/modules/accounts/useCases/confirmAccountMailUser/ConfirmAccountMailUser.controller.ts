import { Response, Request } from "express";
import { container } from "tsyringe";

import { ConfirmAccountMailUserService } from "@modules/accounts/useCases/confirmAccountMailUser/ConfirmAccountMailUser.service";
import { HttpSuccessCodeEnum } from "@shared/infra/http/enums";

class ConfirmAccountMailUserController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { token } = request.query;

    const confirmAccountMailUserService = container.resolve(
      ConfirmAccountMailUserService
    );

    await confirmAccountMailUserService.execute(String(token));

    return response.status(HttpSuccessCodeEnum.NO_CONTENT).send();
  }
}
export { ConfirmAccountMailUserController };
