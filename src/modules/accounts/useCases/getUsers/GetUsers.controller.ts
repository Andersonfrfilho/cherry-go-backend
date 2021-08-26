import { Response, Request } from "express";
import { container } from "tsyringe";

import { GetUsersService } from "@modules/accounts/useCases/getUsers/GetUsers.service";

export class GetUsersController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { per_page, fields, page, order } = request.query;

    const getUsersService = container.resolve(GetUsersService);

    const users = await getUsersService.execute({
      fields: fields && JSON.parse(String(fields)),
      order: order && JSON.parse(String(order)),
      page: String(page),
      per_page: String(per_page),
    });

    return response.json(users);
  }
}
