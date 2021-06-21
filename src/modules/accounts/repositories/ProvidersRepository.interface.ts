import {
  CreatePaymentTypesAvailableRepositoryDTO,
  CreateProviderDaysAvailabilityServiceDTO,
  CreateProviderTimesAvailabilityProviderDTO,
  CreateServiceProviderRepositoryDTO,
} from "@modules/accounts/dtos";
import { Provider } from "@modules/accounts/infra/typeorm/entities/Provider";

export interface ProvidersRepositoryInterface {
  findById(id: string): Promise<Provider>;
  findByIdsActiveAndServices(
    providers_id: Partial<Provider>[]
  ): Promise<Provider[]>;
  findByEmail(email: string): Promise<Provider>;
  createDaysAvailable(
    data: CreateProviderDaysAvailabilityServiceDTO
  ): Promise<void>;
  createTimesAvailable(
    data: CreateProviderTimesAvailabilityProviderDTO
  ): Promise<void>;
  createServiceProvider(
    data: CreateServiceProviderRepositoryDTO
  ): Promise<void>;
  createPaymentTypesAvailable(
    data: CreatePaymentTypesAvailableRepositoryDTO
  ): Promise<void>;
}
