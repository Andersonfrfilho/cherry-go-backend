import { Response, Request } from "express";
import { container } from "tsyringe";

import { GetTariffsServices } from "./GetTariffs.service";

export class GetTariffsController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { id } = request.user;
    const getTariffsServices = container.resolve(GetTariffsServices);

    const tariffs = await getTariffsServices.execute(id);

    return response.json(tariffs);
  }
}
