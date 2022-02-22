import { instanceToInstance } from "class-transformer";
import { Response, Request } from "express";
import { container } from "tsyringe";

import { DeleteProviderTimesAvailabilitiesService } from "@modules/accounts/useCases/deleteProviderTimesAvailabilities/DeleteProviderTimesAvailabilities.service";

export class DeleteProviderTimesAvailabilitiesController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { id } = request.user;
    const { hour_id } = request.body;

    const deleteProviderTimesAvailabilitiesService = container.resolve(
      DeleteProviderTimesAvailabilitiesService
    );

    const hour = await deleteProviderTimesAvailabilitiesService.execute({
      provider_id: id,
      hour_id,
    });

    return response.json(hour);
  }
}
