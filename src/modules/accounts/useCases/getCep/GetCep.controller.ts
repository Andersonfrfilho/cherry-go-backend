import { Response, Request } from "express";
import { container } from "tsyringe";

import { GetCepService } from "./GetCep.service";

export class GetCepController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { id } = request.user;
    const { cep } = request.body;

    const getCepService = container.resolve(GetCepService);

    const availabilities = await getCepService.execute({ user_id: id, cep });

    return response.json(availabilities);
  }
}
