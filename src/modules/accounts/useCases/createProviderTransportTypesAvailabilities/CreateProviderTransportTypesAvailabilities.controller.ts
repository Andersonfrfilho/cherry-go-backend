import { classToClass } from "class-transformer";
import { Response, Request } from "express";
import { container } from "tsyringe";

import { CreateProviderTransportTypesAvailabilitiesService } from "@modules/accounts/useCases/createProviderTransportTypesAvailabilities/CreateProviderTransportTypesAvailabilities.service";

export class CreateProviderTransportTypesAvailabilitiesController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { id } = request.user;
    const { transports_types } = request.body;
    const createProviderTransportTypesAvailabilitiesService = container.resolve(
      CreateProviderTransportTypesAvailabilitiesService
    );

    const transports_available = await createProviderTransportTypesAvailabilitiesService.execute(
      {
        provider_id: id,
        transports_types,
      }
    );

    return response.json(classToClass(transports_available));
  }
}
