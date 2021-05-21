import {
  IJwtVerifyParametersDTO,
  IJwtProviderResponsePayload,
  IJwtAssignParametersDTO,
} from "@shared/container/providers/JwtProvider/dtos";
import { IJwtProvider } from "@shared/container/providers/JwtProvider/IJwtProvider";

class JwtProviderInMemory implements IJwtProvider {
  verifyJwt({
    token,
    auth_secret,
  }: IJwtVerifyParametersDTO): IJwtProviderResponsePayload {
    const { email, id } = JSON.parse(token);
    return { email, sub: { user: { id } } };
  }
  assign(data: IJwtAssignParametersDTO): string {
    return data.secretOrPrivateKey;
  }
}

export { JwtProviderInMemory };
