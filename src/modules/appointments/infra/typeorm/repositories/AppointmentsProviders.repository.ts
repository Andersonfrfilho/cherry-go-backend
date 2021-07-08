import { getRepository, Repository } from "typeorm";

import { CreateAppointmentProvidersRepositoryDTO } from "@modules/appointments/dtos";
import { AppointmentProvider } from "@modules/appointments/infra/typeorm/entities/AppointmentProviders";
import { AppointmentsProvidersRepositoryInterface } from "@modules/appointments/repositories/AppointmentsProvidersRepository.interface";

export class AppointmentsProvidersRepository
  implements AppointmentsProvidersRepositoryInterface {
  private repository: Repository<AppointmentProvider>;

  constructor() {
    this.repository = getRepository(AppointmentProvider);
  }

  async delete(id: string): Promise<void> {
    await this.repository.delete(id);
  }

  async create({
    active,
    appointment_id,
    providers,
  }: CreateAppointmentProvidersRepositoryDTO): Promise<AppointmentProvider[]> {
    return this.repository.save(
      providers.map((provider) => ({
        active,
        appointment_id,
        provider_id: provider.id,
      }))
    );
  }
}
