import { Response, Request } from "express";
import { container } from "tsyringe";

import { HTTP_STATUS_CODE_SUCCESS_ENUM } from "@shared/infra/http/enums";

import { UpdateUserService } from "./UpdateUser.service";

export class UpdateUserController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { id } = request.user;
    const { name, last_name, email } = request.body;
    const updateUserService = container.resolve(UpdateUserService);

    await updateUserService.execute({
      name,
      last_name,
      email,
      user_id: id,
    });

    return response.status(HTTP_STATUS_CODE_SUCCESS_ENUM.NO_CONTENT).send();
  }
}
