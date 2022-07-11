import { Response, Request } from "express";
import { container } from "tsyringe";

import { User } from "@modules/accounts/infra/typeorm/entities/User";
import { GetUserProvidersService } from "@modules/accounts/useCases/getUserProviders/GetUserProviders.service";

export class GetUserProvidersController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { limit, skip, sort, filter } = request.query;

    const getUserProvidersService = container.resolve(GetUserProvidersService);

    const users = await getUserProvidersService.execute({
      limit: Number(limit),
      skip: Number(skip),
    });

    return response.json(users);
  }
}
