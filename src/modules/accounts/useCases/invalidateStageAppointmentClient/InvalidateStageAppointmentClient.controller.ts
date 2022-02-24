import { Response, Request } from "express";
import { container } from "tsyringe";

import { HTTP_STATUS_CODE_SUCCESS_ENUM } from "@shared/infra/http/enums";

import { InvalidateStageAppointmentClientService } from "./InvalidateStageAppointmentClient.service";

export class InvalidateStageAppointmentClientController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { id } = request.user;
    const invalidateStageAppointmentClientService = container.resolve(
      InvalidateStageAppointmentClientService
    );

    await invalidateStageAppointmentClientService.execute(id);

    return response.status(HTTP_STATUS_CODE_SUCCESS_ENUM.NO_CONTENT).send();
  }
}
