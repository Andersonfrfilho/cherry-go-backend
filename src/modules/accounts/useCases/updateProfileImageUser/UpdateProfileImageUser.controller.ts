import { Response, Request } from "express";
import { container } from "tsyringe";

import { UpdateProfileImageUserService } from "@modules/accounts/useCases/updateProfileImageUser/UpdateProfileImageUser.service";
import { HTTP_STATUS_CODE_SUCCESS_ENUM } from "@shared/infra/http/enums";

export class UpdateProfileImageUserController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { id } = request.user;
    const image_profile = request.file.filename;
    const updateProfileImageUserService = container.resolve(
      UpdateProfileImageUserService
    );

    await updateProfileImageUserService.execute({
      image_profile_name: image_profile,
      user_id: id,
    });

    return response.status(HTTP_STATUS_CODE_SUCCESS_ENUM.NO_CONTENT).send();
  }
}
