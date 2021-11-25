import { Response, Request } from "express";
import { container } from "tsyringe";

import { GetReverseGeolocationService } from "./GetReverseGeolocation.service";

export class GetReverseGeolocationController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { id } = request.user;
    const { latitude, longitude } = request.body;

    const getReverseGeolocationService = container.resolve(
      GetReverseGeolocationService
    );

    const address = await getReverseGeolocationService.execute({
      user_id: id,
      latitude,
      longitude,
    });

    return response.json(address);
  }
}
