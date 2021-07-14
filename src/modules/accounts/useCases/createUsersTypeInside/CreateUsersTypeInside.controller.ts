import { Response, Request } from "express";
import { container } from "tsyringe";

import { CreateUsersTypeInside } from "@modules/accounts/useCases/createUsersTypeInside/CreateUsersTypeInside.service";

class CreateUsersTypeInsideController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { id } = request.body;

    const createUsersTypeInside = container.resolve(CreateUsersTypeInside);

    await createUsersTypeInside.execute(id);

    return response.status(204).send();
  }
}
export { CreateUsersTypeInsideController };
