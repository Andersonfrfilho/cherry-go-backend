import { Response, Request } from "express";
import { container } from "tsyringe";

import { CreateDocumentsUsersService } from "@modules/accounts/useCases/createDocumentsUsers/CreateDocumentsUsers.service";

class CreateDocumentsUsersController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { id } = request.user;
    const { description } = request.body;
    const document_file = request.file.filename;
    const createDocumentsUsersClientService = container.resolve(
      CreateDocumentsUsersService
    );

    await createDocumentsUsersClientService.execute({
      document_file,
      user_id: id,
      description,
    });

    return response.status(204).send();
  }
}
export { CreateDocumentsUsersController };
