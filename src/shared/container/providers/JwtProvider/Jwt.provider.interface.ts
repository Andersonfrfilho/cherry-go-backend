import {
  JwtProviderAssignDTO,
  JwtProviderPayload,
  JwtProviderVerifyDTO,
} from "@shared/container/providers/JwtProvider/dtos";

export interface JwtProviderInterface {
  verifyJwt({ token, auth_secret }: JwtProviderVerifyDTO): JwtProviderPayload;
  assign(data: JwtProviderAssignDTO): string;
}
