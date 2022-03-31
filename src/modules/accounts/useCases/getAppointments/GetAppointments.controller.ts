import { Response, Request } from "express";
import { container } from "tsyringe";

import { HTTP_STATUS_CODE_SUCCESS_ENUM } from "@shared/infra/http/enums";

import { GetAppointmentsService } from "./GetAppointments.service";

export class GetAppointmentsController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { id } = request.user;

    const getAppointmentsService = container.resolve(GetAppointmentsService);

    const appointments_page = await getAppointmentsService.execute(id);

    return response.json(appointments_page);
  }
}
