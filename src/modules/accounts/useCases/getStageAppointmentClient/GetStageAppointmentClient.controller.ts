import { Response, Request } from "express";
import { container } from "tsyringe";

import { GetStageAppointmentClientService } from "./GetStageAppointmentClient.service";

export class GetStageAppointmentClientController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { id } = request.user;

    const getStageAppointmentClientService = container.resolve(
      GetStageAppointmentClientService
    );

    const appointment_stage = await getStageAppointmentClientService.execute(
      id
    );

    return response.json(appointment_stage);
  }
}
