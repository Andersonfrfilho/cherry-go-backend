import { Response, Request } from "express";
import { container } from "tsyringe";

import { AuthenticateUserService } from "@modules/accounts/useCases/authenticateUser/AuthenticateUser.service";

export class AuthenticatedUserController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { password, email } = request.body;

    const authenticateUserService = container.resolve(AuthenticateUserService);

    const authenticateInfo = await authenticateUserService.execute({
      email,
      password,
    });

    return response.json(authenticateInfo);
  }
}
