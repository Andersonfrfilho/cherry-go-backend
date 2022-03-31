import { Response, Request } from "express";
import { container } from "tsyringe";

import { GetProvidersService } from "./GetProviders.service";

export class GetProvidersController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { id } = request.user;
    const { address, distance } = request.query;
    const getProvidersService = container.resolve(GetProvidersService);

    const providers = await getProvidersService.execute({
      user_id: id,
      address,
      distance,
    });

    return response.json(providers);
  }
}
