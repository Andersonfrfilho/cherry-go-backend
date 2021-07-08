import { sign, verify } from "jsonwebtoken";

import {
  JwtProviderAssignDTO,
  JwtProviderVerifyDTO,
  JwtProviderPayload,
} from "@shared/container/providers/JwtProvider/dtos";
import { JwtProviderInterface } from "@shared/container/providers/JwtProvider/Jwt.provider.interface";

interface IPayload {
  email: string;
  sub: string;
}

export class JsonWebTokenProvider implements JwtProviderInterface {
  verifyJwt({ token, auth_secret }: JwtProviderVerifyDTO): JwtProviderPayload {
    const { email, sub } = verify(token, auth_secret) as IPayload;
    return { email, sub: JSON.parse(sub) };
  }

  assign({
    payload,
    secretOrPrivateKey,
    options,
  }: JwtProviderAssignDTO): string {
    const { email } = payload;
    const { subject, expiresIn } = options;
    return sign({ email }, secretOrPrivateKey, {
      subject: JSON.stringify(subject),
      expiresIn,
    });
  }
}
