import { Response, Request } from "express";
import { container } from "tsyringe";

import { TermsAcceptUserService } from "@modules/accounts/useCases/termsAcceptsUser/TermsAcceptsUser.service";
import { HTTP_STATUS_CODE_SUCCESS_ENUM } from "@shared/infra/http/enums";

class TermsAcceptUserController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { accept } = request.body;
    const { id } = request.user;

    const termsAcceptUserService = container.resolve(TermsAcceptUserService);

    await termsAcceptUserService.execute({
      accept,
      user_id: id,
    });

    return response.status(HTTP_STATUS_CODE_SUCCESS_ENUM.NO_CONTENT).send();
  }
}
export { TermsAcceptUserController };
