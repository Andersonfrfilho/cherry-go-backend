import { Response, Request } from "express";
import { container } from "tsyringe";

import { CreateTagsUsersService } from "@modules/accounts/useCases/createTagsUsersClient/CreateTagsUsersClient.service";

class CreateTagsUsersController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { tags } = request.body;
    const { id } = request.user;

    const termsAcceptUserService = container.resolve(CreateTagsUsersService);

    await termsAcceptUserService.execute({
      tags,
      user_id: id,
    });

    return response.status(204).send();
  }
}
export { CreateTagsUsersController };
