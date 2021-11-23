import { Response, Request } from "express";
import { container } from "tsyringe";

import { GetAllBanksService } from "./GetAllBanks.service";

export class GetAllBanksController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { id } = request.user;

    const getAllBanksService = container.resolve(GetAllBanksService);

    const banks = await getAllBanksService.execute(id);

    return response.json(banks);
  }
}
