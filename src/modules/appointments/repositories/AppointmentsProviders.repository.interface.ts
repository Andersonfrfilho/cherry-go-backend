import { ChangeStatusAppointmentRepositoryDTO } from "@modules/accounts/dtos/repositories/ChangeStatusAppointment.repository.dto";
import { FindByIdsAppointmentProviderRepositoryDTO } from "@modules/accounts/dtos/repositories/FindByIdsAppointmentProvider.repository.dto";
import { CreateAppointmentProvidersRepositoryDTO } from "@modules/appointments/dtos";

import { AppointmentProvider } from "../infra/typeorm/entities/AppointmentProvider";

export interface AppointmentsProvidersRepositoryInterface {
  create(
    data: CreateAppointmentProvidersRepositoryDTO
  ): Promise<AppointmentProvider[]>;
  delete(id: string): Promise<void>;
  changeStatusAppointment(
    data: ChangeStatusAppointmentRepositoryDTO
  ): Promise<void>;
  findByIds(
    data: FindByIdsAppointmentProviderRepositoryDTO
  ): Promise<AppointmentProvider>;
}
