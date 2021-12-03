import { Response, Request } from "express";
import { container } from "tsyringe";

import { GetCitiesByStateService } from "./GetCitiesByState.service";

export class GetCitiesByStateController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { id } = request.user;
    const { state } = request.params;

    const getCitiesByStateService = container.resolve(GetCitiesByStateService);

    const cities = await getCitiesByStateService.execute({
      user_id: id,
      state,
    });

    return response.json(cities);
  }
}
