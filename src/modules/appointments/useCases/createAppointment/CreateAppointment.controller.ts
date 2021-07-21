import { Response, Request } from "express";
import { container } from "tsyringe";

import { CreateAppointmentService } from "@modules/appointments/useCases/createAppointment/CreateAppointment.service";
import { HTTP_STATUS_CODE_SUCCESS_ENUM } from "@shared/infra/http/enums";

class CreateAppointmentController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { users, appointment, providers, local, transactions } = request.body;

    const createAppointmentService = container.resolve(
      CreateAppointmentService
    );

    await createAppointmentService.execute({
      users,
      appointment,
      providers,
      local,
      transactions,
    });

    return response.status(HTTP_STATUS_CODE_SUCCESS_ENUM.NO_CONTENT).send();
  }
}
export { CreateAppointmentController };
