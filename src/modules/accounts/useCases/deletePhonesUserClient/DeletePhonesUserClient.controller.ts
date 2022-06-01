import { instanceToInstance } from "class-transformer";
import { Response, Request } from "express";
import { container } from "tsyringe";

import { HTTP_STATUS_CODE_SUCCESS_ENUM } from "@shared/infra/http/enums";

import { DeletePhonesUserClientService } from "./DeletePhonesUserClient.service";

export class DeletePhonesUserClientController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { user_id } = request.body;
    const deletePhonesUserClientService = container.resolve(
      DeletePhonesUserClientService
    );

    await deletePhonesUserClientService.execute(user_id);

    return response.status(HTTP_STATUS_CODE_SUCCESS_ENUM.NO_CONTENT).send();
  }
}
