import { Response, Request } from "express";
import { container } from "tsyringe";

import { TermsAcceptUserService } from "@modules/accounts/useCases/termsAcceptsUser/TermsAcceptsUser.service";

class TermsAcceptUserController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { accept } = request.body;
    const { id } = request.user;

    const termsAcceptUserService = container.resolve(TermsAcceptUserService);

    await termsAcceptUserService.execute({
      accept,
      user_id: id,
    });

    return response.status(204).send();
  }
}
export { TermsAcceptUserController };
