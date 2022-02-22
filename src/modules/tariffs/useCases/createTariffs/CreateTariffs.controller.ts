import { instanceToInstance } from "class-transformer";
import { Response, Request } from "express";
import { container } from "tsyringe";

import { CreateTariffsService } from "./CreateTariffs.service";

export class CreateTariffsController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { id } = request.user;
    const { name, percent } = request.body;

    const createTariffsService = container.resolve(CreateTariffsService);

    const tag = await createTariffsService.execute({
      name,
      percent,
      user_id: id,
    });
    return response.json(instanceToInstance(tag));
  }
}
