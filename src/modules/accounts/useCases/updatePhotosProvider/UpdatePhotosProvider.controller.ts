import { Response, Request } from "express";
import { Multer } from "multer";
import { container } from "tsyringe";

import { HTTP_STATUS_CODE_SUCCESS_ENUM } from "@shared/infra/http/enums";

import { UpdatePhotosProviderService } from "./UpdatePhotosProvider.service";

export class UpdatePhotosProviderController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { id } = request.user;
    const { images } = request.body;

    const updatePhotosProviderService = container.resolve(
      UpdatePhotosProviderService
    );

    await updatePhotosProviderService.execute({
      images,
      provider_id: id,
    });

    return response.status(HTTP_STATUS_CODE_SUCCESS_ENUM.NO_CONTENT).send();
  }
}
