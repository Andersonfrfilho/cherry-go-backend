import { Response, Request } from "express";
import { container } from "tsyringe";

import { HTTP_STATUS_CODE_SUCCESS_ENUM } from "@shared/infra/http/enums";

import { VerifyPaymentAccountInfosService } from "./VerifyPaymentAccountInfos.service";

export class VerifyPaymentAccountInfosController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { id } = request.user;

    const verifyPaymentAccountInfosService = container.resolve(
      VerifyPaymentAccountInfosService
    );
    const requirements = await verifyPaymentAccountInfosService.execute(id);

    return response.json(requirements);
  }
}
