import { Response, Request } from "express";
import { container } from "tsyringe";

import { CreateUsersTypeProviders } from "@modules/accounts/useCases/createUsersTypeProviders/CreateUsersTypeProviders.service";
import { HTTP_STATUS_CODE_SUCCESS_ENUM } from "@shared/infra/http/enums";

class CreateUsersTypeProvidersController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { id } = request.user;

    const createUsersTypeProviders = container.resolve(
      CreateUsersTypeProviders
    );

    await createUsersTypeProviders.execute(id);

    return response.status(HTTP_STATUS_CODE_SUCCESS_ENUM.NO_CONTENT).send();
  }
}
export { CreateUsersTypeProvidersController };
