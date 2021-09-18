import { Response, Request } from "express";
import { container } from "tsyringe";

import { GetTagsService } from "@modules/tags/useCases/getTags/GetTags.service";

export class GetTagsController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { per_page, fields, page, order, user_id } = request.query;
    const getTagsService = container.resolve(GetTagsService);

    const tags = await getTagsService.execute({
      fields: fields && JSON.parse(String(fields)),
      order: order && JSON.parse(String(order)),
      page: page && String(page),
      per_page: per_page && String(per_page),
      user_id: user_id && String(user_id),
    });

    return response.json(tags);
  }
}
