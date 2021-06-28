import { Response, Request } from "express";
import { container } from "tsyringe";

import { CreateDocumentsUsersService } from "@modules/accounts/useCases/createDocumentsUsers/CreateDocumentsUsers.service";
import { HttpSuccessCodeEnum } from "@shared/infra/http/enums";

class CreateDocumentsUsersController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { id } = request.user;
    const { description } = request.body;
    const document_file = request.file.filename;
    const createDocumentsUsersService = container.resolve(
      CreateDocumentsUsersService
    );

    await createDocumentsUsersService.execute({
      document_file,
      user_id: id,
      description,
    });

    return response.status(HttpSuccessCodeEnum.NO_CONTENT).send();
  }
}
export { CreateDocumentsUsersController };
