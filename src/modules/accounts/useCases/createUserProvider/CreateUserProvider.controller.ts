import { Response, Request } from "express";
import { container } from "tsyringe";

import { CreateUserProviderService } from "@modules/accounts/useCases/createUserProvider/CreateUserProvider.service";

class CreateUserProviderController {
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
      term_client,
      term_provider,
    } = request.body;

    const createUserProviderService = container.resolve(
      CreateUserProviderService
    );

    const user = await createUserProviderService.execute({
      name,
      last_name,
      cpf,
      rg,
      email,
      gender,
      password: password_confirm,
      birth_date,
      term: term_client,
      term_provider,
    });

    return response.json(user);
  }
}
export { CreateUserProviderController };
