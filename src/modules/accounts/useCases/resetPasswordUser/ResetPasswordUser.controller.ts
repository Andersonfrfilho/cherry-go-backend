import { Response, Request } from "express";
import { container } from "tsyringe";

import { ResetPasswordService } from "@modules/accounts/useCases/resetPasswordUser/ResetPasswordUser.service";

class ResetPasswordUserController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { token } = request.query;
    const { password } = request.body;

    const resetPasswordService = container.resolve(ResetPasswordService);
    console.log(token, password);
    await resetPasswordService.execute({
      token: String(token),
      password,
    });

    return response.status(204).send();
  }
}
export { ResetPasswordUserController };
