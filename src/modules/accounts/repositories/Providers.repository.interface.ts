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
import { CreateProviderTransportTypesDTO } from "@modules/transports/dtos/repositories/CreateProviderTransportTypes.repository.dto";
import { DisableProviderTransportTypeRepositoryDTO } from "@modules/transports/dtos/repositories/DisableProviderTransportType.repository.dto";
import { TransportType } from "@modules/transports/infra/typeorm/entities/TransportType";

import { CreateProviderAddressRepositoryDTO } from "../dtos/repositories/CreateProviderAddressRepository.dto";
import { CreateProviderLocalProviderAddressDTO } from "../dtos/repositories/CreateProviderLocalProviderAddress.dto";
import { CreateProviderLocalsTypesRepositoryDTO } from "../dtos/repositories/CreateProviderLocalsTypesRepository.dto";
import { CreateUserProviderRepositoryDTO } from "../dtos/repositories/CreateUserProviderType.repository.dto";
import { DeleteAllDaysProviderAvailableRepositoryDTO } from "../dtos/repositories/DeleteAllDaysProviderAvailableRepository.dto";
import { DeleteProviderLocalsTypesRepositoryDTO } from "../dtos/repositories/DeleteProviderLocalsTypesRepository.dto";
import { GetAllByActiveProviderTransportTypeRepositoryDTO } from "../dtos/repositories/GetAllByActiveProviderTransportTypeRepository.dto";
import {
  PaginationPropsDTO,
  PaginationPropsGenericDTO,
  PaginationResponseAppointmentsDTO,
  PaginationResponsePropsDTO,
} from "../dtos/repositories/PaginationProps.dto";
import { UpdateTransportTypeAvailableRepositoryDTO } from "../dtos/repositories/UpdateTransportTypeAvailableRepository.dto";
import { ProviderAddress } from "../infra/typeorm/entities/ProviderAddress";
import { ProviderAvailabilityTime } from "../infra/typeorm/entities/ProviderAvailabilityTime";
import { ProviderLocalType } from "../infra/typeorm/entities/ProviderLocalType";
import { ProviderPaymentType } from "../infra/typeorm/entities/ProviderPaymentType";
import { ProviderTransportType } from "../infra/typeorm/entities/ProviderTransportTypes";

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
  deleteAllDaysProviderAvailable(
    data: DeleteAllDaysProviderAvailableRepositoryDTO
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
  createProviderLocalsTypes(
    data: CreateProviderLocalsTypesRepositoryDTO
  ): Promise<ProviderLocalType[]>;
  deleteProviderLocalsTypes(
    data: DeleteProviderLocalsTypesRepositoryDTO
  ): Promise<void>;
  createProviderLocals(
    data: CreateProviderLocalProviderAddressDTO
  ): Promise<void>;
  getProviderLocals(provider_id: string): Promise<ProviderAddress[]>;
  deleteProviderLocals(ids: string[]): Promise<void>;
  createProviderTransportType(
    data: CreateProviderTransportTypesDTO
  ): Promise<ProviderTransportType[]>;
  deleteProviderTransportType(
    provider_transport_type_ids: string[]
  ): Promise<void>;
  getAllByActiveProviderTransportType(
    data: GetAllByActiveProviderTransportTypeRepositoryDTO
  ): Promise<ProviderTransportType[]>;
  updateTransportTypesAvailable(
    data: UpdateTransportTypeAvailableRepositoryDTO
  ): Promise<void>;
}
