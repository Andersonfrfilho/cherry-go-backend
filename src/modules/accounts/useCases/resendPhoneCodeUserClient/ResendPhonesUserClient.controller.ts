import { instanceToInstance } from "class-transformer";
import { Response, Request } from "express";
import { container } from "tsyringe";

import { ResendPhoneCodeUserClientService } from "@modules/accounts/useCases/resendPhoneCodeUserClient/ResendPhonesUserClient.service";

class ResendPhonesUserClientController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { user_id } = request.body;
    const resendPhoneCodeUserClientService = container.resolve(
      ResendPhoneCodeUserClientService
    );

    const user_phones = await resendPhoneCodeUserClientService.execute({
      user_id,
    });

    return response.json(instanceToInstance(user_phones));
  }
}
export { ResendPhonesUserClientController };
