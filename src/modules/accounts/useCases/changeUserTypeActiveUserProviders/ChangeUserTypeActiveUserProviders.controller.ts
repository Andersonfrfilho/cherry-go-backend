import { Response, Request } from "express";
import { container } from "tsyringe";

import { ChangeUserTypeActiveUserProvidersService } from "@modules/accounts/useCases/changeUserTypeActiveUserProviders/ChangeUserTypeActiveUserProviders.service";
import { HTTP_STATUS_CODE_SUCCESS_ENUM } from "@shared/infra/http/enums";

class ChangeUserTypeActiveUserProvidersController {
  async handle(request: Request, response: Response): Promise<Response> {
    const data = request.body;
    const { limit, skip } = request.query;
    const changeUserTypeActiveUserProvidersService = container.resolve(
      ChangeUserTypeActiveUserProvidersService
    );

    const users = await changeUserTypeActiveUserProvidersService.execute({
      users: data,
      limit,
      skip,
    });

    return response.json(users);
  }
}
export { ChangeUserTypeActiveUserProvidersController };
