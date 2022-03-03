import { StripeProviderLocal } from "@modules/accounts/infra/typeorm/entities/ProviderAddress";
import { StripeProviderTransportType } from "@modules/accounts/infra/typeorm/entities/ProviderTransportTypes";
import { StripeProviderService } from "@modules/accounts/infra/typeorm/entities/Services";

interface CreateOrderItemDTO {
  id: string;
  stripe:
    | StripeProviderTransportType
    | StripeProviderService
    | StripeProviderLocal;
  amount: number;
}
export interface CreateOrderDTO {
  itens: CreateOrderItemDTO[];
  customer_stripe_id: string;
}
