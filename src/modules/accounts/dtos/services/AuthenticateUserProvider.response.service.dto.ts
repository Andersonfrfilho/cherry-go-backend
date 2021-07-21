import { Provider } from "@modules/accounts/infra/typeorm/entities/Provider";

export interface AuthenticateUserProviderServiceResponseDTO {
  user: Provider;
  token: string;
  refresh_token: string;
}
