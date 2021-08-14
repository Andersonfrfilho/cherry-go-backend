import { Response, Request } from "express";
import { container } from "tsyringe";

import { ActiveTypeInsideService } from "@modules/accounts/useCases/activeAccountTypeInside/ActiveUserTypeInside.service";
import { HTTP_STATUS_CODE_SUCCESS_ENUM } from "@shared/infra/http/enums";

export class ActiveUserTypeInsideController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { cpf, rg, email } = request.body;

    const activeUserClientService = container.resolve(ActiveAccountService);
    await activeUserClientService.execute({
      cpf,
      rg,
      email,
    });

    return response.status(HTTP_STATUS_CODE_SUCCESS_ENUM.NO_CONTENT).send();
  }
}
