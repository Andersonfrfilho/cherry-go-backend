import { Response, Request } from "express";
import { container } from "tsyringe";

import { CreateProfileImageUserService } from "@modules/accounts/useCases/createProfileImageUser/CreateProfileImageUser.service";

export class CreatePhotoProfileUsersController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { id } = request.user;
    const image_profile = request.file.filename;
    const createProfileImageUserService = container.resolve(
      CreateProfileImageUserService
    );

    await createProfileImageUserService.execute({
      image_profile_name: image_profile,
      user_id: id,
    });

    return response.status(204).send();
  }
}
