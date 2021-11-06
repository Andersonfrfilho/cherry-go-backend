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

import { CreateProviderAddressRepositoryDTO } from "../dtos/repositories/CreateProviderAddressRepository.dto";
import { CreateUserProviderRepositoryDTO } from "../dtos/repositories/CreateUserProviderType.repository.dto";
import { DeleteAllDaysProviderAvailableRepositoryDTO } from "../dtos/repositories/DeleteAllDaysProviderAvailableRepository.dto";
import {
  PaginationPropsDTO,
  PaginationPropsGenericDTO,
  PaginationResponseAppointmentsDTO,
  PaginationResponsePropsDTO,
} from "../dtos/repositories/PaginationProps.dto";
import { ProviderAddress } from "../infra/typeorm/entities/ProviderAddress";
import { ProviderAvailabilityTime } from "../infra/typeorm/entities/ProviderAvailabilityTime";
import { ProviderPaymentType } from "../infra/typeorm/entities/ProviderPaymentType";

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
  deleteAllDaysProviderAvailable({
    provider_id,
  }: DeleteAllDaysProviderAvailableRepositoryDTO): Promise<void>;
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
  findByProviderHoursAvailable(
    provider_id: string
  ): Promise<ProviderAvailabilityTime[]>;
  excludeProviderHourAvailable(
    provider_id: string | Array<string>
  ): Promise<void>;
  updateProviderHourAvailable(data: ProviderAvailabilityTime): Promise<void>;
  deletePaymentTypes(data: Array<string>): Promise<void>;
  getAllPaymentTypes(id: string): Promise<ProviderPaymentType[]>;
  getAllAddressByProviders(id: string): Promise<ProviderAddress[]>;
  deleteProviderAddress(ids: Array<string>): Promise<void>;
  createProviderAddress(
    data: CreateProviderAddressRepositoryDTO
  ): Promise<void>;
}
