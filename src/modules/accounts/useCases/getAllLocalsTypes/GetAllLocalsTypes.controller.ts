import { Response, Request } from "express";
import { container } from "tsyringe";

import { GetAllLocalsTypesService } from "./GetAllLocalsTypes.service";

export class GetAllLocalsTypesController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { id } = request.user;
    const getAllLocalsTypesService = container.resolve(
      GetAllLocalsTypesService
    );

    const availabilities = await getAllLocalsTypesService.execute(id);

    return response.json(availabilities);
  }
}
