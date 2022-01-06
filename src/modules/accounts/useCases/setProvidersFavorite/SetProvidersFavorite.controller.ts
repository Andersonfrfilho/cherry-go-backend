import { Response, Request } from "express";
import { container } from "tsyringe";

import { SetProvidersFavoriteService } from "./SetProvidersFavorite.service";

export class SetProvidersFavoriteController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { id } = request.user;
    const { provider_id, distance, latitude, longitude } = request.body;
    const setProvidersFavoriteService = container.resolve(
      SetProvidersFavoriteService
    );

    const providers = await setProvidersFavoriteService.execute({
      user_id: id,
      provider_id,
      distance,
      latitude,
      longitude,
    });

    return response.json(providers);
  }
}
