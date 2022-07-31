import { Response, Request } from "express";
import { container } from "tsyringe";

import { GetProvidersService } from "./GetProviders.service";

export class GetProvidersController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { id } = request.user;
    const { distance, longitude, latitude } = request.query;
    const getProvidersService = container.resolve(GetProvidersService);

    const providers = await getProvidersService.execute({
      user_id: id,
      distance: Number(distance),
      longitude: String(longitude),
      latitude: String(latitude),
    });

    return response.json(providers);
  }
}
