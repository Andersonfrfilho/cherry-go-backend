import { Response, Request } from "express";
import { container } from "tsyringe";

import { GetSpecifiesTariffsServices } from "./GetSpecifiesTariffs.service";

export class GetSpecifiesTariffsController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { id } = request.user;
    const { tariff_type } = request.body;
    const getSpecifiesTariffsServices = container.resolve(
      GetSpecifiesTariffsServices
    );

    const tariffs_found = await getSpecifiesTariffsServices.execute({
      user_id: id,
      tariff_type,
    });

    return response.json(tariffs_found);
  }
}
