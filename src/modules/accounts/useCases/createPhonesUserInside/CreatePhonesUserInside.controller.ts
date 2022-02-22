import { instanceToInstance } from "class-transformer";
import { Response, Request } from "express";
import { container } from "tsyringe";

import { CreatePhonesUserInsideService } from "@modules/accounts/useCases/createPhonesUserInside/CreateUserPhonesClient.service";

export class CreatePhonesUserInsideController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { country_code, ddd, number, user_id } = request.body;
    const createPhonesUserInsideService = container.resolve(
      CreatePhonesUserInsideService
    );

    const user_address = await createPhonesUserInsideService.execute({
      user_id,
      country_code,
      ddd,
      number,
    });

    return response.json(instanceToInstance(user_address));
  }
}
