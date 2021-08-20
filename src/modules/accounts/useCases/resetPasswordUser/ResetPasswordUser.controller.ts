import { Response, Request } from "express";
import { container } from "tsyringe";

import { ResetPasswordService } from "@modules/accounts/useCases/resetPasswordUser/ResetPasswordUser.service";

export class ResetPasswordUserController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { password, token } = request.body;

    const resetPasswordService = container.resolve(ResetPasswordService);
    await resetPasswordService.execute({
      token: String(token),
      password,
    });

    return response.status(204).send();
  }
}
