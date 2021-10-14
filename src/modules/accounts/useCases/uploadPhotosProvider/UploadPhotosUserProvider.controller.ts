import { Response, Request } from "express";
import { Multer } from "multer";
import { container } from "tsyringe";

import { HTTP_STATUS_CODE_SUCCESS_ENUM } from "@shared/infra/http/enums";

import { UploadPhotosProviderService } from "./UploadPhotosUserProvider.service";

export class UploadPhotosProviderController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { id } = request.user;
    const photos = request.files;

    const photos_filename = photos.map(
      (photo: Express.Multer.File) => photo.filename
    );

    const uploadPhotosProviderService = container.resolve(
      UploadPhotosProviderService
    );

    await uploadPhotosProviderService.execute({
      images_name: photos_filename,
      provider_id: id,
    });

    return response.status(HTTP_STATUS_CODE_SUCCESS_ENUM.NO_CONTENT).send();
  }
}
