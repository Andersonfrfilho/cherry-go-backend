import {
  IJwtVerifyParametersDTO,
  IJwtProviderResponsePayload,
  IJwtAssignParametersDTO,
} from "../dtos";
import { IJwtProvider } from "../IJwtProvider";

class JwtProviderInMemory implements IJwtProvider {
  verifyJwt({
    token,
    auth_secret,
  }: IJwtVerifyParametersDTO): IJwtProviderResponsePayload {
    const data = {
      user: {
        id: auth_secret,
      },
    };
    return { email: token, sub: data };
  }
  assign(data: IJwtAssignParametersDTO): string {
    return data.secretOrPrivateKey;
  }
}

export { JwtProviderInMemory };
