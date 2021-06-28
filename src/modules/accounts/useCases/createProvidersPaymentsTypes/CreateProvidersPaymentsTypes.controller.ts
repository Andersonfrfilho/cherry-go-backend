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

    await createProvidersPaymentsTypesService.execute({
      provider_id: id,
      payments_types,
    });

    return response.status(204).send();
  }
}
export { CreateProvidersPaymentsTypesController };
