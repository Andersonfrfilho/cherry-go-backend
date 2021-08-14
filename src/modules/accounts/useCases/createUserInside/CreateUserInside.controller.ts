import { Response, Request } from "express";
import { container } from "tsyringe";

import { CreateUserInsideService } from "@modules/accounts/useCases/createUserInside/CreateUserInside.service";

export class CreateUserInsideController {
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

    const createUserInsideService = container.resolve(CreateUserInsideService);

    const user = await createUserInsideService.execute({
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
