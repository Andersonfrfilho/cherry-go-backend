import { Response, Request } from "express";
import { container } from "tsyringe";

import { GetTransportTypesService } from "./GetTransportTypes.service";

export class GetTransportTypesController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { id } = request.user;
    const getTransportTypesService = container.resolve(
      GetTransportTypesService
    );

    const transport_types = await getTransportTypesService.execute(id);

    return response.json(transport_types);
  }
}
