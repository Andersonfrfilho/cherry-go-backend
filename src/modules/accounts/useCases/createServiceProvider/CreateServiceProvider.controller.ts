import { Response, Request } from "express";
import { container } from "tsyringe";

import { CreateServiceProviderService } from "@modules/accounts/useCases/createServiceProvider/CreateServiceProvider.service";

class CreateServiceProviderController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { id } = request.user;
    const { name, amount, duration, tags_id } = request.body;
    const createServiceProviderService = container.resolve(
      CreateServiceProviderService
    );

    await createServiceProviderService.execute({
      provider_id: id,
      name,
      amount,
      duration,
      tags_id,
    });

    return response.status(204).send();
  }
}
export { CreateServiceProviderController };
