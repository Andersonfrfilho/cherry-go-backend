import { Response, Request } from "express";
import { container } from "tsyringe";

import { DeleteLocalsTypesProvidersService } from "./DeleteLocalsTypesProviders.service";

export class DeleteProvidersLocalsTypesController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { id } = request.user;
    const { provider_locals_types_ids } = request.body;
    const deleteLocalsTypesProvidersService = container.resolve(
      DeleteLocalsTypesProvidersService
    );

    const availabilities = await deleteLocalsTypesProvidersService.execute({
      provider_id: id,
      provider_locals_types_ids,
    });

    return response.json(availabilities);
  }
}
