import { Response, Request } from "express";
import { container } from "tsyringe";

import { RejectAppointmentProviderService } from "@modules/appointments/useCases/rejectAppointmentProvider/RejectAppointmentProvider.service";
import { HTTP_STATUS_CODE_SUCCESS_ENUM } from "@shared/infra/http/enums";

class RejectAppointmentProviderController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { id } = request.user;
    const { appointment_id } = request.body;

    const rejectAppointmentProviderService = container.resolve(
      RejectAppointmentProviderService
    );

    await rejectAppointmentProviderService.execute({
      provider_id: id,
      appointment_id,
    });

    return response.status(HTTP_STATUS_CODE_SUCCESS_ENUM.NO_CONTENT).send();
  }
}
export { RejectAppointmentProviderController };
