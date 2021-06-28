import { classToClass } from "class-transformer";
import { Response, Request } from "express";
import { container } from "tsyringe";

import { CreateAddressUserProviderService } from "@modules/accounts/useCases/createAddressUserProvider/CreateAddressUserProvider.service";

export class CreateAddressUserProviderController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { id } = request.user;
    const {
      street,
      number,
      zipcode,
      district,
      city,
      state,
      country,
      longitude,
      latitude,
    } = request.body;
    const createAddressUserProviderService = container.resolve(
      CreateAddressUserProviderService
    );

    const provider_address = await createAddressUserProviderService.execute({
      provider_id: id,
      street,
      number,
      zipcode,
      district,
      city,
      state,
      country,
      longitude,
      latitude,
    });

    return response.json(classToClass(provider_address));
  }
}
