import { Response, Request } from "express";
import { container } from "tsyringe";

import { CreateUsersTypeInside } from "@modules/accounts/useCases/createUsersTypeInside/CreateUsersTypeInside.service";
import { HTTP_STATUS_CODE_SUCCESS_ENUM } from "@shared/infra/http/enums";

class CreateUsersTypeInsideController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { id } = request.body;

    const createUsersTypeInside = container.resolve(CreateUsersTypeInside);

    await createUsersTypeInside.execute(id);

    return response.status(HTTP_STATUS_CODE_SUCCESS_ENUM.OK).send();
  }
}
export { CreateUsersTypeInsideController };
