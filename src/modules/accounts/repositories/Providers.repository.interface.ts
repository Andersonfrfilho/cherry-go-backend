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
import { Appointment } from "@modules/appointments/infra/typeorm/entities/Appointment";

import { CreateUserProviderRepositoryDTO } from "../dtos/repositories/CreateUserProviderType.repository.dto";
import {
  PaginationPropsDTO,
  PaginationPropsGenericDTO,
  PaginationResponseAppointmentsDTO,
  PaginationResponsePropsDTO,
} from "../dtos/repositories/PaginationProps.dto";

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
  findAppointments(
    data: PaginationPropsGenericDTO<Appointment>
  ): Promise<PaginationResponseAppointmentsDTO<Appointment>>;
}
