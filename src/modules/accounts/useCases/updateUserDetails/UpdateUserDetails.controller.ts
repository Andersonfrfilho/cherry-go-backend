import { Response, Request } from "express";
import { container } from "tsyringe";

import { UpdateUserDetailsService } from "@modules/accounts/useCases/updateUserDetails/UpdateUserDetails.service";
import { HTTP_STATUS_CODE_SUCCESS_ENUM } from "@shared/infra/http/enums";

export class UpdateUserDetailsController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { id } = request.user;
    const { details } = request.body;
    const updateUserDetailsService = container.resolve(
      UpdateUserDetailsService
    );

    await updateUserDetailsService.execute({
      details,
      user_id: id,
    });

    return response.status(HTTP_STATUS_CODE_SUCCESS_ENUM.NO_CONTENT).send();
  }
}
