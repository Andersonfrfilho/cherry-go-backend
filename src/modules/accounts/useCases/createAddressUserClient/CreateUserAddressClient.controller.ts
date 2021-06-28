import { classToClass } from "class-transformer";
import { Response, Request } from "express";
import { container } from "tsyringe";

import { CreateUserAddressClientService } from "@modules/accounts/useCases/createAddressUserClient/CreateUserAddressClient.service";

class CreateUserAddressClientController {
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
    } = request.body;
    const createUserAddressClientService = container.resolve(
      CreateUserAddressClientService
    );

    const user_address = await createUserAddressClientService.execute({
      user_id: id,
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
export { CreateUserAddressClientController };
