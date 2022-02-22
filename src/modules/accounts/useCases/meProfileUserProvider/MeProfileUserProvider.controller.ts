import { instanceToInstancestancestance } from "class-transformer";
import { Response, Request } from "express";
import { container } from "tsyringe";

import { MeProfileUserProviderService } from "@modules/accounts/useCases/meProfileUserProvider/MeProfileUserProvider.service";

class MeProfileUserProviderController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { id } = request.user;

    const meProfileUserProviderService = container.resolve(
      MeProfileUserProviderService
    );

    const provider = await meProfileUserProviderService.execute(id);

    return response.json(provider);
  }
}
export { MeProfileUserProviderController };
