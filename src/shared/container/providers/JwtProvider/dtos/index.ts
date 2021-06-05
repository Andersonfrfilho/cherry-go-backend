import { User } from "@modules/accounts/infra/typeorm/entities/User";
import { IJwtAssignParametersDTO } from "@shared/container/providers/JwtProvider/dtos/IJwtAssingParameters.dto";
import { IJwtVerifyParametersDTO } from "@shared/container/providers/JwtProvider/dtos/IJwtVerifyParameters.dto";

export interface Sub {
  user: Partial<User>;
  code_hash?: string;
}

interface IJwtProviderResponsePayload {
  sub: Partial<Sub>;
  email: string;
}

export {
  IJwtVerifyParametersDTO,
  IJwtAssignParametersDTO,
  IJwtProviderResponsePayload,
};
