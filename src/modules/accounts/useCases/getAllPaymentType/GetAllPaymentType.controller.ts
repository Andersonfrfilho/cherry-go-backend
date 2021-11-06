import { Response, Request } from "express";
import { container } from "tsyringe";

import { GetAllPaymentTypeServiceService } from "@modules/accounts/useCases/getAllPaymentType/GetAllPaymentType.service";

export class GetAllPaymentTypeController {
  async handle(request: Request, response: Response): Promise<Response> {
    const getAllPaymentTypeService = container.resolve(
      GetAllPaymentTypeServiceService
    );

    const availabilities = await getAllPaymentTypeService.execute();

    return response.json(availabilities);
  }
}
