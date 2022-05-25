import { Response, Request } from "express";
import { container } from "tsyringe";

import { GetGeolocationByAddressService } from "./GetGeolocationByAddress.service";

export class GetGeolocationByAddressController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { address } = request.body;

    const getGeolocationByAddressService = container.resolve(
      GetGeolocationByAddressService
    );

    const address_result = await getGeolocationByAddressService.execute({
      address,
    });

    return response.json(address_result);
  }
}
