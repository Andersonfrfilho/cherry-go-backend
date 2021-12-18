import { InterfaceDetailsService } from "@modules/accounts/infra/typeorm/entities/Services";

export interface CreateServiceProviderRepositoryDTO {
  provider_id: string;
  name: string;
  amount: number;
  duration: number;
  active: boolean;
  details?: InterfaceDetailsService;
}
