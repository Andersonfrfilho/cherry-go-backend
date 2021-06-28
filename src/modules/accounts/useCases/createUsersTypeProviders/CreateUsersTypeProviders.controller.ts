import { Response, Request } from "express";
import { container } from "tsyringe";

import { CreateUsersTypeProviders } from "@modules/accounts/useCases/createUsersTypeProviders/CreateUsersTypeProviders.service";

class CreateUsersTypeProvidersController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { id } = request.user;

    const createUsersTypeProviders = container.resolve(
      CreateUsersTypeProviders
    );

    await createUsersTypeProviders.execute(id);

    return response.status(204).send();
  }
}
export { CreateUsersTypeProvidersController };
