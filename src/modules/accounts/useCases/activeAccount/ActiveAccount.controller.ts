import { Response, Request } from "express";
import { container } from "tsyringe";

import { ActiveAccountService } from "@modules/accounts/useCases/activeAccount/ActiveAccount.service";
import { HttpSuccessCodeEnum } from "@shared/infra/http/enums";

class ActiveUserClientController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { cpf, rg, email } = request.body;

    const activeUserClientService = container.resolve(ActiveAccountService);

    await activeUserClientService.execute({
      cpf,
      rg,
      email,
    });

    return response.status(HttpSuccessCodeEnum.NO_CONTENT).send();
  }
}
export { ActiveUserClientController };
