import { Response, Request } from "express";
import { container } from "tsyringe";

import { CreateLocalProvidersService } from "@modules/accounts/useCases/createLocalProviders/CreateLocalProviders.service";

export class CreateLocalProvidersController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { id } = request.user;
    const { provider_addresses_ids } = request.body;
    const createLocalProvidersService = container.resolve(
      CreateLocalProvidersService
    );

    const availabilities = await createLocalProvidersService.execute({
      provider_addresses_ids,
      provider_id: id,
    });

    return response.json(availabilities);
  }
}
