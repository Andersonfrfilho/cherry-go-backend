import { classToClass } from "class-transformer";
import { Response, Request } from "express";
import { container } from "tsyringe";

import { CreateUserPhonesClientService } from "@modules/accounts/useCases/createPhonesUserClient/CreateUserPhonesClient.service";

class CreateUserPhoneClientController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { country_code, ddd, number, user_id } = request.body;
    const createUserPhonesClientService = container.resolve(
      CreateUserPhonesClientService
    );

    const user_phones = await createUserPhonesClientService.execute({
      user_id,
      country_code,
      ddd,
      number,
    });

    return response.json(classToClass(user_phones));
  }
}
export { CreateUserPhoneClientController };
