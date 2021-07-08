import {
  CreateAddressUsersProvidersRepositoryDTO,
  CreatePaymentTypesAvailableRepositoryDTO,
  CreateProviderDaysAvailabilityServiceDTO,
  CreateProviderTimesAvailabilityProviderDTO,
  CreateServiceProviderRepositoryDTO,
} from "@modules/accounts/dtos";
import { Provider } from "@modules/accounts/infra/typeorm/entities/Provider";

import { CreateTransportTypesAvailableRepositoryDTO } from "../dtos/repositories/CreateTransportTypesAvailableRepository.dto";

export interface ProvidersRepositoryInterface {
  findById(id: string): Promise<Provider>;
  createAddressProviders(
    data: CreateAddressUsersProvidersRepositoryDTO
  ): Promise<void>;
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
  createTransportTypesAvailable(
    data: CreateTransportTypesAvailableRepositoryDTO
  ): Promise<void>;
}
