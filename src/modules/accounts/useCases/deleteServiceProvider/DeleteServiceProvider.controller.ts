import { Response, Request } from "express";
import { container } from "tsyringe";

import { DeleteServiceProviderService } from "./DeleteServiceProvider.service";

class DeleteServiceProviderController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { id } = request.user;
    const { service_id } = request.body;
    const deleteServiceProviderService = container.resolve(
      DeleteServiceProviderService
    );

    const services = await deleteServiceProviderService.execute({
      provider_id: id,
      service_id,
    });

    return response.json(services);
  }
}
export { DeleteServiceProviderController };
