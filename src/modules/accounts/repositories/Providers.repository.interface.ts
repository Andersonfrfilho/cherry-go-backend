import {
  CreateAddressUsersProvidersRepositoryDTO,
  CreatePaymentTypesAvailableRepositoryDTO,
  CreateProviderDaysAvailabilityServiceDTO,
  CreateProviderTimesAvailabilityProviderDTO,
  CreateServiceProviderRepositoryDTO,
  CreateTransportTypesAvailableRepositoryDTO,
} from "@modules/accounts/dtos";
import { Provider } from "@modules/accounts/infra/typeorm/entities/Provider";
import { CreateAppointmentProviders } from "@modules/appointments/dtos/services/CreateAppointment.service.dto";

import { CreateUserProviderRepositoryDTO } from "../dtos/repositories/CreateUserProviderType.repository.dto";

export interface ProvidersRepositoryInterface {
  findById(id: string): Promise<Provider>;
  createAddressProviders(
    data: CreateAddressUsersProvidersRepositoryDTO
  ): Promise<void>;
  findByIdsActiveAndServices(
    providers: Partial<CreateAppointmentProviders>[]
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
  createUserProviderType(
    data: CreateUserProviderRepositoryDTO
  ): Promise<Provider>;
}
