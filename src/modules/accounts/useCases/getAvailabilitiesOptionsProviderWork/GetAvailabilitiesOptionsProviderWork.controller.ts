import { Response, Request } from "express";
import { container } from "tsyringe";

import { GetAvailabilitiesOptionsProviderWorkService } from "@modules/accounts/useCases/getAvailabilitiesOptionsProviderWork/GetAvailabilitiesOptionsProviderWork.service";

export class GetAvailabilitiesOptionsProviderWorkController {
  async handle(request: Request, response: Response): Promise<Response> {
    const getAvailabilitiesOptionsProviderWorkService = container.resolve(
      GetAvailabilitiesOptionsProviderWorkService
    );

    const availabilities = await getAvailabilitiesOptionsProviderWorkService.execute();

    return response.json(availabilities);
  }
}
