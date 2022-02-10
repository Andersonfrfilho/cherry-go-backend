import { Response, Request } from "express";
import { container } from "tsyringe";

import { GetDistanceByLocalsService } from "./GetDistanceByLocals.service";

export class GetDistanceByLocalsController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { id } = request.user;
    const { provider_id, departure_time } = request.body;

    const getDistanceByLocalsService = container.resolve(
      GetDistanceByLocalsService
    );

    const address_result = await getDistanceByLocalsService.execute({
      user_id: id,
      provider_id,
      departure_time: Number(departure_time),
    });

    return response.json(address_result);
  }
}
