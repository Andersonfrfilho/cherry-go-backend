import { Response, Request } from "express";
import { container } from "tsyringe";

import { SetLocationCacheProvidersService } from "./SetLocationCacheProviders.service";

export class SetLocationCacheProvidersController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { id } = request.user;
    const { latitude, longitude } = request.body;
    const setLocationCacheProvidersService = container.resolve(
      SetLocationCacheProvidersService
    );

    const providers = await setLocationCacheProvidersService.execute({
      provider_id: id,
      latitude,
      longitude,
    });

    return response.json(providers);
  }
}
