import { Response, Request } from "express";
import { container } from "tsyringe";

import { ConfirmAppointmentProviderService } from "@modules/appointments/useCases/confirmAppointmentProvider/ConfirmAppointmentProvider.service";
import { HTTP_STATUS_CODE_SUCCESS_ENUM } from "@shared/infra/http/enums";

class ConfirmAppointmentProviderController {
  async handle(request: Request, response: Response): Promise<Response> {
    console.log("##########################");
    const { id } = request.user;
    const { appointment_id } = request.body;

    const confirmAppointmentProviderService = container.resolve(
      ConfirmAppointmentProviderService
    );
    console.log("##########################");
    await confirmAppointmentProviderService.execute({
      provider_id: id,
      appointment_id,
    });

    return response.status(HTTP_STATUS_CODE_SUCCESS_ENUM.NO_CONTENT).send();
  }
}
export { ConfirmAppointmentProviderController };
