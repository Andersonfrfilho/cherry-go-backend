import { Response, Request } from "express";
import { container } from "tsyringe";

import { HTTP_STATUS_CODE_SUCCESS_ENUM } from "@shared/infra/http/enums";

import { CreateAppointmentPaymentCardService } from "./CreateAppointmentPaymentCard.service";

export class CreateAppointmentPaymentCardController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { id } = request.user;

    const createAppointmentPaymentCardService = container.resolve(
      CreateAppointmentPaymentCardService
    );

    await createAppointmentPaymentCardService.execute(id);

    return response.status(HTTP_STATUS_CODE_SUCCESS_ENUM.NO_CONTENT).send();
  }
}
