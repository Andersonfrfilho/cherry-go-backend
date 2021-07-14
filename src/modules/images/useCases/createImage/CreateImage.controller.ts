import { Response, Request } from "express";
import { container } from "tsyringe";

import { CreateImageService } from "@modules/images/useCases/createImage/CreateImage.service";

export class CreateImageController {
  async handle(request: Request, response: Response): Promise<Response> {
    const image_file_name = request.file.filename;

    const createImageService = container.resolve(CreateImageService);
    const image = await createImageService.execute({
      name: image_file_name,
    });

    return response.json(image);
  }
}
