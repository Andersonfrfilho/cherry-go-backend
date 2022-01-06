import { Response, Request } from "express";
import { container } from "tsyringe";

import { HTTP_STATUS_CODE_SUCCESS_ENUM } from "@shared/infra/http/enums";

import { SetStageAppointmentClientService } from "./SetStageAppointmentClient.service";

export class SetStageAppointmentClientController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { id } = request.user;
    const { provider, services, stage } = request.body;
    const setStageAppointmentClientService = container.resolve(
      SetStageAppointmentClientService
    );

    await setStageAppointmentClientService.execute({
      user_id: id,
      data: { provider, services, stage },
    });

    return response.status(HTTP_STATUS_CODE_SUCCESS_ENUM.NO_CONTENT).send();
  }
}
