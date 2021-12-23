import { Response, Request } from "express";
import { container } from "tsyringe";

import { RefreshTokenService } from "@modules/accounts/useCases/refreshToken/RefreshToken.service";

class RefreshTokenController {
  async handle(request: Request, response: Response): Promise<Response> {
    const refresh_token =
      request.body.refresh_token ||
      request.headers["x-access-refresh-token"] ||
      request.query.refresh_token;
    const refreshTokenService = container.resolve(RefreshTokenService);
    const new_tokens = await refreshTokenService.execute(refresh_token);

    return response.json(new_tokens);
  }
}
export { RefreshTokenController };
