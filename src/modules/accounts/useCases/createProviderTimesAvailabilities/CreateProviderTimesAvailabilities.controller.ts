import { instanceToInstance } from "class-transformer";
import { Response, Request } from "express";
import { container } from "tsyringe";

import { CreateProviderTimesAvailabilitiesService } from "@modules/accounts/useCases/createProviderTimesAvailabilities/CreateProviderTimesAvailabilities.service";

class CreateProviderTimesAvailabilitiesController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { id } = request.user;
    const { start_hour, end_hour } = request.body;

    const createProviderTimesAvailabilityService = container.resolve(
      CreateProviderTimesAvailabilitiesService
    );

    const hour = await createProviderTimesAvailabilityService.execute({
      provider_id: id,
      start_hour,
      end_hour,
    });

    return response.json(hour);
  }
}
export { CreateProviderTimesAvailabilitiesController };
