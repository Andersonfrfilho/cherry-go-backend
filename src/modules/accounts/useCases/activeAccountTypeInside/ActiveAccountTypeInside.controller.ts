import { Response, Request } from "express";
import { container } from "tsyringe";

import { ActiveTypeInsideService } from "@modules/accounts/useCases/activeAccountTypeInside/ActiveAccountTypeInside.service";
import { HTTP_STATUS_CODE_SUCCESS_ENUM } from "@shared/infra/http/enums";

export class ActiveUserTypeInsideController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { cpf, rg, email } = request.body;

    const activeTypeInsideService = container.resolve(ActiveTypeInsideService);
    await activeTypeInsideService.execute({
      cpf,
      rg,
      email,
    });

    return response.status(HTTP_STATUS_CODE_SUCCESS_ENUM.NO_CONTENT).send();
  }
}
