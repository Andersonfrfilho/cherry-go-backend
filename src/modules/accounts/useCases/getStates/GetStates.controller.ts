import { Response, Request } from "express";
import { container } from "tsyringe";

import { GetStatesService } from "./GetStates.service";

export class GetStatesController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { id } = request.user;

    const getStatesService = container.resolve(GetStatesService);

    const states = await getStatesService.execute(id);

    return response.json(states);
  }
}
