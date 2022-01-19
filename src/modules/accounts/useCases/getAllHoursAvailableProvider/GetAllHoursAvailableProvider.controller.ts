import { Response, Request } from "express";
import { container } from "tsyringe";

import { GetAllHoursAvailableProviderService } from "./GetAllHoursAvailableProvider.service";

export class GetAllHoursAvailableProviderController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { id } = request.user;
    const { provider_id, duration } = request.body;
    const getAllHoursAvailableProviderService = container.resolve(
      GetAllHoursAvailableProviderService
    );

    const hours = await getAllHoursAvailableProviderService.execute({
      provider_id,
      user_id: id,
      duration,
    });

    return response.json(hours);
  }
}
