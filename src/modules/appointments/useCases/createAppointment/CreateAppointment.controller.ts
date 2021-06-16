import { Response, Request } from "express";
import { container } from "tsyringe";

import { CreateAppointmentService } from "@modules/appointments/useCases/createAppointment/CreateAppointment.service";
import { HttpSuccessCodeEnum } from "@shared/infra/http/enums";

class CreateAppointmentController {
  async handle(request: Request, response: Response): Promise<Response> {
    const {
      services,
      transactions,
      transports,
      users,
      providers,
      providers_services,
    } = request.body;

    const createAppointmentService = container.resolve(
      CreateAppointmentService
    );

    await createAppointmentService.execute({
      services,
      transactions,
      transports,
      users,
      providers,
      providers_services,
    });

    return response.status(HttpSuccessCodeEnum.NO_CONTENT).send();
  }
}
export { CreateAppointmentController };
