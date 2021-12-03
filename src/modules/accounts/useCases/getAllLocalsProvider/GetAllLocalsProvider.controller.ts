import { Response, Request } from "express";
import { container } from "tsyringe";

import { GetAllLocalsProviderService } from "./GetAllLocalsProvider.service";

export class GetAllLocalsProvidersController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { id } = request.user;
    const getAllLocalsProviderService = container.resolve(
      GetAllLocalsProviderService
    );

    const locals = await getAllLocalsProviderService.execute(id);

    return response.json(locals);
  }
}
