import { instanceToInstance } from "class-transformer";
import { Response, Request } from "express";
import { container } from "tsyringe";

import { CreateProvidersPaymentsTypesService } from "@modules/accounts/useCases/createProvidersPaymentsTypes/CreateProvidersPaymentsTypes.service";

class CreateProvidersPaymentsTypesController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { id } = request.user;
    const { payments_types } = request.body;
    const createProvidersPaymentsTypesService = container.resolve(
      CreateProvidersPaymentsTypesService
    );

    const provider_payments_types = await createProvidersPaymentsTypesService.execute(
      {
        provider_id: id,
        payments_types,
      }
    );

    return response.json(instanceToInstance(provider_payments_types));
  }
}
export { CreateProvidersPaymentsTypesController };
