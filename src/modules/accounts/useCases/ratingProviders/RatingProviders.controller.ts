import { Response, Request } from "express";
import { container } from "tsyringe";

import { RatingProvidersService } from "./RatingProviders.service";

export class RatingProvidersController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { id } = request.user;
    const { details, provider_id, value } = request.body;
    const ratingProvidersService = container.resolve(RatingProvidersService);

    const providers = await ratingProvidersService.execute({
      user_id: id,
      details,
      provider_id,
      value,
    });

    return response.json(providers);
  }
}
