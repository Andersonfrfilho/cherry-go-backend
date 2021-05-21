import { sign, verify } from "jsonwebtoken";

import {
  IJwtVerifyParametersDTO,
  IJwtAssignParametersDTO,
  IJwtProviderResponsePayload,
} from "@shared/container/providers/JwtProvider/dtos";
import { IJwtProvider } from "@shared/container/providers/JwtProvider/IJwtProvider";

interface IPayload {
  email: string;
  sub: string;
}

class JsonWebTokenProvider implements IJwtProvider {
  verifyJwt({
    token,
    auth_secret,
  }: IJwtVerifyParametersDTO): IJwtProviderResponsePayload {
    const { email, sub } = verify(token, auth_secret) as IPayload;
    return { email, sub: JSON.parse(sub) };
  }

  assign({
    payload,
    secretOrPrivateKey,
    options,
  }: IJwtAssignParametersDTO): string {
    const { email } = payload;
    const { subject, expiresIn } = options;
    return sign({ email }, secretOrPrivateKey, {
      subject: JSON.stringify(subject),
      expiresIn,
    });
  }
}
export { JsonWebTokenProvider };
