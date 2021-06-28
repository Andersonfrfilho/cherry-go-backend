import { Response, Request } from "express";
import { container } from "tsyringe";

import { CreateTagsUsersClientService } from "@modules/accounts/useCases/createTagsUsersClient/CreateTagsUsersClient.service";

class CreateTagsUsersController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { tags } = request.body;
    const { id } = request.user;

    const createTagsUsersClientService = container.resolve(
      CreateTagsUsersClientService
    );

    await createTagsUsersClientService.execute({
      tags,
      user_id: id,
    });

    return response.status(204).send();
  }
}
export { CreateTagsUsersController };
