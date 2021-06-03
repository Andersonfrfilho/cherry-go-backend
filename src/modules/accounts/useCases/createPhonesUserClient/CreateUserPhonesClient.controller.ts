import { classToClass } from "class-transformer";
import { Response, Request } from "express";
import { container } from "tsyringe";

import { CreateUserPhonesClientService } from "@modules/accounts/useCases/createPhonesUserClient/CreateUserPhonesClient.service";

class CreateUserPhoneClientController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { id } = request.user;
    const { country_code, ddd, number } = request.body;
    const createUserPhonesClientService = container.resolve(
      CreateUserPhonesClientService
    );

    const user_address = await createUserPhonesClientService.execute({
      user_id: id,
      country_code,
      ddd,
      number,
    });

    return response.json(classToClass(user_address));
  }
}
export { CreateUserPhoneClientController };
