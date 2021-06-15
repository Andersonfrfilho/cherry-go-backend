import { Response, Request } from "express";
import { container } from "tsyringe";

import { CreateProviderDaysAvailabilitiesService } from "@modules/accounts/useCases/createProviderDaysAvailabilities/CreateProviderDaysAvailabilities.service";

class CreateProviderDaysAvailabilitiesController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { id } = request.user;
    const { days } = request.body;
    const createProviderDaysAvailabilityService = container.resolve(
      CreateProviderDaysAvailabilitiesService
    );

    await createProviderDaysAvailabilityService.execute({
      provider_id: id,
      days,
    });

    return response.status(204).send();
  }
}
export { CreateProviderDaysAvailabilitiesController };
