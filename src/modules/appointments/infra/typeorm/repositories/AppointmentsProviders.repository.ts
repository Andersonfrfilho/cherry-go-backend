import { getRepository, Repository } from "typeorm";

import { ChangeStatusAppointmentRepositoryDTO } from "@modules/accounts/dtos/repositories/ChangeStatusAppointment.repository.dto";
import { FindByIdsAppointmentProviderRepositoryDTO } from "@modules/accounts/dtos/repositories/FindByIdsAppointmentProvider.repository.dto";
import { CreateAppointmentProvidersRepositoryDTO } from "@modules/appointments/dtos";
import { AppointmentProvider } from "@modules/appointments/infra/typeorm/entities/AppointmentProviders";
import { AppointmentsProvidersRepositoryInterface } from "@modules/appointments/repositories/AppointmentsProviders.repository.interface";

export class AppointmentsProvidersRepository
  implements AppointmentsProvidersRepositoryInterface {
  private repository: Repository<AppointmentProvider>;

  constructor() {
    this.repository = getRepository(AppointmentProvider);
  }
  async findByIds({
    provider_id,
    appointment_id,
  }: FindByIdsAppointmentProviderRepositoryDTO): Promise<AppointmentProvider> {
    const appointment_provider = await this.repository.findOne({
      provider_id,
      appointment_id,
    });
    return appointment_provider;
  }
  async changeStatusAppointment({
    appointment_id,
    status,
    provider_id,
  }: ChangeStatusAppointmentRepositoryDTO): Promise<void> {
    await this.repository.update({ appointment_id, provider_id }, { status });
  }

  async delete(id: string): Promise<void> {
    await this.repository.delete(id);
  }

  async create({
    status,
    appointment_id,
    providers,
  }: CreateAppointmentProvidersRepositoryDTO): Promise<AppointmentProvider[]> {
    return this.repository.save(
      providers.map((provider) => ({
        status,
        appointment_id,
        provider_id: provider.id,
      }))
    );
  }
}
