import { User } from "@modules/accounts/infra/typeorm/entities/User";

export { JwtProviderAssignDTO } from "@shared/container/providers/JwtProvider/dtos/JwtProviderAssing.dto";
export { JwtProviderVerifyDTO } from "@shared/container/providers/JwtProvider/dtos/JwtProviderVerify.dto";

export interface Sub {
  user: Partial<User>;
  code_hash?: string;
}

export interface JwtProviderPayload {
  sub: Partial<Sub>;
  email: string;
}
