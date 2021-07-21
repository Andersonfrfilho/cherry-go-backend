import { Response, Request } from "express";
import { container } from "tsyringe";

import { CreateUserClientService } from "@modules/accounts/useCases/createUserClient/CreateUserClient.service";

class CreateUserClientController {
  async handle(request: Request, response: Response): Promise<Response> {
    const {
      name,
      last_name,
      cpf,
      rg,
      email,
      password_confirm,
      birth_date,
      gender,
    } = request.body;

    const createUserClientService = container.resolve(CreateUserClientService);

    const user = await createUserClientService.execute({
      name,
      last_name,
      cpf,
      rg,
      email,
      gender,
      password: password_confirm,
      birth_date,
    });

    return response.json(user);
  }
}
export { CreateUserClientController };
