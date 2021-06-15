import { Response, Request } from "express";
import { container } from "tsyringe";

import { CreateProviderTimesAvailabilitiesService } from "@modules/accounts/useCases/createProviderTimesAvailabilities/CreateProviderTimesAvailabilities.service";

class CreateProviderTimesAvailabilitiesController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { id } = request.user;
    const { times } = request.body;

    const createProviderTimesAvailabilityService = container.resolve(
      CreateProviderTimesAvailabilitiesService
    );

    await createProviderTimesAvailabilityService.execute({
      provider_id: id,
      times,
    });

    return response.status(204).send();
  }
}
export { CreateProviderTimesAvailabilitiesController };
