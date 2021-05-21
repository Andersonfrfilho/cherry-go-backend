import {
  IJwtVerifyParametersDTO,
  IJwtAssignParametersDTO,
  IJwtProviderResponsePayload,
} from "@shared/container/providers/JwtProvider/dtos";

interface IJwtProvider {
  verifyJwt({
    token,
    auth_secret,
  }: IJwtVerifyParametersDTO): IJwtProviderResponsePayload;
  assign(data: IJwtAssignParametersDTO): string;
}

export { IJwtProvider };
