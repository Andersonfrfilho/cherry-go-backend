import { Response, Request } from "express";
import { container } from "tsyringe";

import { HTTP_STATUS_CODE_SUCCESS_ENUM } from "@shared/infra/http/enums";

import { UpdatePaymentAccountPersonService } from "./UpdatePaymentAccountPerson.service";

export class UpdatePaymentAccountPersonController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { id } = request.user;

    const updatePaymentAccountPersonService = container.resolve(
      UpdatePaymentAccountPersonService
    );
    await updatePaymentAccountPersonService.execute(id);

    return response.status(HTTP_STATUS_CODE_SUCCESS_ENUM.NO_CONTENT).send();
  }
}
