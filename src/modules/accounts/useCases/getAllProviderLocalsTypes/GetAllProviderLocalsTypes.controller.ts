import { Response, Request } from "express";
import { container } from "tsyringe";

import { GetAllLocalsTypesProvidersService } from "./GetAllProviderLocalsTypes.service";

export class GetAllProvidersLocalsTypesController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { id } = request.user;
    const getAllLocalsTypesProvidersService = container.resolve(
      GetAllLocalsTypesProvidersService
    );

    const availabilities = await getAllLocalsTypesProvidersService.execute(id);

    return response.json(availabilities);
  }
}
