import { Response, Request } from "express";
import { container } from "tsyringe";

import { ActiveAccountService } from "@modules/accounts/useCases/activeAccount/ActiveAccount.service";

class ActiveUserClientController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { cpf, rg, email } = request.body;

    const activeUserClientService = container.resolve(ActiveAccountService);

    await activeUserClientService.execute({
      cpf,
      rg,
      email,
    });

    return response.status(204).send();
  }
}
export { ActiveUserClientController };
