import { classToClass } from "class-transformer";
import { Response, Request } from "express";
import { container } from "tsyringe";

import { CreateTagsService } from "@modules/tags/useCases/createTags/CreateTags.service";

class CreateTagsController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { name, description, active, image_id } = request.body;

    const createTagsService = container.resolve(CreateTagsService);

    const tag = await createTagsService.execute({
      name,
      description,
      active,
      image_id,
    });
    return response.json(classToClass(tag));
  }
}
export { CreateTagsController };
