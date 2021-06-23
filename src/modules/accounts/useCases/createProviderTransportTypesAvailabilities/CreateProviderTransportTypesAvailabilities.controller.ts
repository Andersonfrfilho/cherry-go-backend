import { Response, Request } from "express";
import { container } from "tsyringe";

import { CreateProviderTransportTypesAvailabilitiesService } from "@modules/accounts/useCases/createProviderTransportTypesAvailabilities/CreateProviderTransportTypesAvailabilities.service";

export class CreateProviderTransportTypesAvailabilitiesController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { id } = request.user;
    const { transport_types } = request.body;
    const createProviderTransportTypesAvailabilitiesService = container.resolve(
      CreateProviderTransportTypesAvailabilitiesService
    );

    await createProviderTransportTypesAvailabilitiesService.execute({
      provider_id: id,
      transport_types,
    });

    return response.status(204).send();
  }
}
