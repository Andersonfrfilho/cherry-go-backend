import { classToClass } from "class-transformer";
import { Response, Request } from "express";
import { container } from "tsyringe";

import { CreateAddressUserInsideService } from "@modules/accounts/useCases/createAddressUserInside/CreateAddressUserInside.service";

export class CreateAddressUserInsideController {
  async handle(request: Request, response: Response): Promise<Response> {
    const {
      user_id,
      street,
      number,
      zipcode,
      district,
      city,
      state,
      country,
    } = request.body;
    const createAddressUserInsideService = container.resolve(
      CreateAddressUserInsideService
    );

    const user_address = await createAddressUserInsideService.execute({
      user_id,
      street,
      number,
      zipcode,
      district,
      city,
      state,
      country,
    });

    return response.json(classToClass(user_address));
  }
}
