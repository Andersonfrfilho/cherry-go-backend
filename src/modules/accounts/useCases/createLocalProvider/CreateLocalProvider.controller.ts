import { Response, Request } from "express";
import { container } from "tsyringe";

import { CreateLocalProviderService } from "./CreateLocalProviders.service";

export class CreateLocalProviderController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { id } = request.user;
    const {
      amount,
      city,
      complement,
      country,
      district,
      number,
      reference,
      state,
      street,
      zipcode,
      latitude,
      longitude,
    } = request.body;

    const createLocalProviderService = container.resolve(
      CreateLocalProviderService
    );

    const locals = await createLocalProviderService.execute({
      provider_id: id,
      amount,
      city,
      complement,
      country,
      district,
      number,
      reference,
      state,
      street,
      zipcode,
      latitude,
      longitude,
    });

    return response.json(locals);
  }
}
