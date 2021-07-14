import { Response, Request } from "express";
import { container } from "tsyringe";

import { CreateImageService } from "@modules/images/useCases/createImage/CreateImage.service";

export class CreateTransportController {
  async handle(request: Request, response: Response): Promise<Response> {
    console.log("##################");
    const image_file_name = request.file.filename;
    const createImageService = container.resolve(CreateImageService);
    console.log(request.file);

    const image = await createImageService.execute({
      name: image_file_name,
    });

    return response.json(image);
  }
}
