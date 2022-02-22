import { instanceToInstance } from "class-transformer";
import { Response, Request } from "express";
import { container } from "tsyringe";

import { MeUserProfileService } from "@modules/accounts/useCases/meUserProfile/MeUserProfile.service";

export class MeUserProfileController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { id } = request.user;

    const meUserProfileService = container.resolve(MeUserProfileService);

    const meUserInfoProfile = await meUserProfileService.execute(id);

    return response.json(instanceToInstance(meUserInfoProfile));
  }
}
