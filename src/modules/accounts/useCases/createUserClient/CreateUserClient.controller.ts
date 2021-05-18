import { classToClass } from "class-transformer";
import { Response, Request } from "express";
import { container } from "tsyringe";

import { CreateUserClientUseCase } from "@modules/accounts/useCases/createUserClient/CreateUserClient.services";

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
    } = request.body;

    const createUserClientUseCase = container.resolve(CreateUserClientUseCase);

    const user = await createUserClientUseCase.execute({
      name,
      last_name,
      cpf,
      rg,
      email,
      password: password_confirm,
      birth_date,
    });

    return response.json(classToClass(user));
  }
}
export { CreateUserClientController };
