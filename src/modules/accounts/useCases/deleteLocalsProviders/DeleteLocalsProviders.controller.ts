import { Response, Request } from "express";
import { container } from "tsyringe";

import { DeleteLocalsProvidersService } from "@modules/accounts/useCases/deleteLocalsProviders/DeleteLocalsProviders.service";

export class DeleteLocalsProvidersController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { id } = request.user;
    const { provider_addresses_ids } = request.body;
    const deleteLocalsProvidersService = container.resolve(
      DeleteLocalsProvidersService
    );

    const availabilities = await deleteLocalsProvidersService.execute({
      provider_addresses_ids,
      provider_id: id,
    });

    return response.json(availabilities);
  }
}
