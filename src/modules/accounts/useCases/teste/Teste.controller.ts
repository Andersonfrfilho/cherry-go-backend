import { Response, Request } from "express";
import { container } from "tsyringe";

import { CreateUsersTypeInsideService } from "@modules/accounts/useCases/createUsersTypeInside/CreateUsersTypeInside.service";
import { HTTP_STATUS_CODE_SUCCESS_ENUM } from "@shared/infra/http/enums";

import { TesteService } from "./Teste.service";

export class TesteController {
  async handle(request: Request, response: Response): Promise<Response> {
    const testeService = container.resolve(TesteService);

    await testeService.execute();

    return response.status(HTTP_STATUS_CODE_SUCCESS_ENUM.OK).send();
  }
}
