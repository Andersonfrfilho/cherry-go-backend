import { Response, Request } from "express";
import { container } from "tsyringe";

import { CreateTagsUsersClientService } from "@modules/accounts/useCases/createTagsUsersClient/CreateTagsUsersClient.service";
import { HTTP_STATUS_CODE_SUCCESS_ENUM } from "@shared/infra/http/enums";

class CreateTagsUsersController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { id } = request.user;
    const { tags } = request.body;

    const createTagsUsersClientService = container.resolve(
      CreateTagsUsersClientService
    );

    await createTagsUsersClientService.execute({
      tags,
      client_id: id,
    });

    return response.status(HTTP_STATUS_CODE_SUCCESS_ENUM.NO_CONTENT).send();
  }
}
export { CreateTagsUsersController };
