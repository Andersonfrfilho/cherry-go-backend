import { Response, Request } from "express";
import { container } from "tsyringe";

import { CreateUserAddressClientService } from "@modules/accounts/useCases/createAddressUserClient/CreateUserAddressClient.service";

export class CreateUserAddressClientController {
  async handle(request: Request, response: Response): Promise<Response> {
    const {
      street,
      number,
      zipcode,
      district,
      city,
      state,
      country,
      user_id,
      latitude,
      longitude,
      complement,
      reference,
    } = request.body;
    const createUserAddressClientService = container.resolve(
      CreateUserAddressClientService
    );

    const user_address = await createUserAddressClientService.execute({
      user_id,
      street,
      number,
      zipcode,
      district,
      city,
      state,
      country,
      latitude,
      longitude,
      complement,
      reference,
    });

    return response.json(user_address);
  }
}
