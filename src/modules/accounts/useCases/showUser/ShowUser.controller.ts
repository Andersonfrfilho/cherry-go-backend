import { Response, Request } from "express";
import { container } from "tsyringe";

import { ShowUsersService } from "@modules/accounts/useCases/showUser/ShowUser.service";

export class ShowUsersController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { id } = request.path;

    const showUsersService = container.resolve(ShowUsersService);

    const user = await showUsersService.execute(id);

    return response.json(user);
  }
}
