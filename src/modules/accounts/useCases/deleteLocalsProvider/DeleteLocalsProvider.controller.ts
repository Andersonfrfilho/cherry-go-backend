import { Response, Request } from "express";
import { container } from "tsyringe";

import { DeleteLocalsProviderService } from "./DeleteLocalsProvider.service";

export class DeleteLocalsProviderController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { id } = request.user;
    const { provider_addresses_ids } = request.body;
    const deleteLocalsProviderService = container.resolve(
      DeleteLocalsProviderService
    );

    const locals = await deleteLocalsProviderService.execute({
      provider_addresses_ids,
      provider_id: id,
    });

    return response.json(locals);
  }
}
