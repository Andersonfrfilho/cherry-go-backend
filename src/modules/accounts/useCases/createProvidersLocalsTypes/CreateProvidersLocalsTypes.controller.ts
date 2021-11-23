import { classToClass } from "class-transformer";
import { Response, Request } from "express";
import { container } from "tsyringe";

import { CreateProvidersLocalsTypesService } from "./CreateProvidersLocalsTypes.service";

class CreateProvidersLocalsTypesController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { id } = request.user;
    const { locals_types } = request.body;
    const createProvidersLocalsTypesService = container.resolve(
      CreateProvidersLocalsTypesService
    );

    const locals_types_response = await createProvidersLocalsTypesService.execute(
      {
        provider_id: id,
        locals_types,
      }
    );

    return response.json(classToClass(locals_types_response));
  }
}
export { CreateProvidersLocalsTypesController };
