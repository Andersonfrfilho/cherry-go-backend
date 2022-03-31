import { Response, Request } from "express";
import { container } from "tsyringe";

import { CreateClientAppointmentService } from "./CreateClientAppointment.service";

export class CreateClientAppointmentController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { id } = request.user;

    const createClientAppointmentService = container.resolve(
      CreateClientAppointmentService
    );

    const appointment = await createClientAppointmentService.execute(id);

    return response.json(appointment);
  }
}
