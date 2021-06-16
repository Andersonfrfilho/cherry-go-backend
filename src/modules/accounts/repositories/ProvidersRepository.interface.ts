import {
  CreateProviderDaysAvailabilityServiceDTO,
  CreateProviderTimesAvailabilityProviderDTO,
  CreateServiceProviderRepositoryDTO,
} from "@modules/accounts/dtos";
import { Provider } from "@modules/accounts/infra/typeorm/entities/Provider";

interface ProvidersRepositoryInterface {
  findById(id: string): Promise<Provider>;
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
}

export { ProvidersRepositoryInterface };
