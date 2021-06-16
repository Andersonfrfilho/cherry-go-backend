import { Response, Request } from "express";
import { container } from "tsyringe";

import { CreateServicesProvidersService } from "@modules/accounts/useCases/createServicesProviders/CreateServicesProviders.service";

class CreateServicesProvidersController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { id } = request.user;
    const { days } = request.body;
    const createServicesProvidersService = container.resolve(
      CreateServicesProvidersService
    );

    await createServicesProvidersService.execute({
      provider_id: id,
      days,
    });

    return response.status(204).send();
  }
}
export { CreateServicesProvidersController };
