import { Response, Request } from "express";
import { Multer } from "multer";
import { container } from "tsyringe";

import { HTTP_STATUS_CODE_SUCCESS_ENUM } from "@shared/infra/http/enums";

import { DeletePhotosProviderService } from "./DeletePhotosProvider.service";

export class DeletePhotosProviderController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { id } = request.user;
    const { images } = request.body;

    const deletePhotosProviderService = container.resolve(
      DeletePhotosProviderService
    );

    await deletePhotosProviderService.execute({
      images_providers: images,
      provider_id: id,
    });

    return response.status(HTTP_STATUS_CODE_SUCCESS_ENUM.NO_CONTENT).send();
  }
}
