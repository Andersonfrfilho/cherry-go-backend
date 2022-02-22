import { instanceToInstance } from "class-transformer";
import { Response, Request } from "express";
import { container } from "tsyringe";

import { AuthenticateUserProviderService } from "@modules/accounts/useCases/authenticateUserProvider/AuthenticateUserProvider.service";

class AuthenticateUserProviderController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { password, email } = request.body;

    const authenticateUserProviderService = container.resolve(
      AuthenticateUserProviderService
    );

    const authenticateInfo = await authenticateUserProviderService.execute({
      email,
      password,
    });

    return response.json(authenticateInfo);
  }
}
export { AuthenticateUserProviderController };
