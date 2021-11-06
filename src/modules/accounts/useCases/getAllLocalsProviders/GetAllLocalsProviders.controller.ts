import { Response, Request } from "express";
import { container } from "tsyringe";

import { GetAllLocalsProvidersService } from "@modules/accounts/useCases/getAllLocalsProviders/GetAllLocalsProviders.service";

export class GetAllLocalsProvidersController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { id } = request.user;

    const getAllLocalsProvidersService = container.resolve(
      GetAllLocalsProvidersService
    );

    const availabilities = await getAllLocalsProvidersService.execute(id);

    return response.json(availabilities);
  }
}
