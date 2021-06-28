import { getRepository, Repository } from "typeorm";

import { CreateAppointmentProvidersServiceRepositoryDTO } from "@modules/appointments/dtos";
import { AppointmentsProvidersServicesRepositoryInterface } from "@modules/appointments/repositories/AppointmentsProvidersServicesRepository.interface";

import { AppointmentProviderService } from "../entities/AppointmentsProvidersServices";

export class AppointmentsProvidersServicesRepository
  implements AppointmentsProvidersServicesRepositoryInterface {
  private repository: Repository<AppointmentProviderService>;

  constructor() {
    this.repository = getRepository(AppointmentProviderService);
  }
  async create({
    appointment_id,
    services,
  }: CreateAppointmentProvidersServiceRepositoryDTO): Promise<void> {
    await this.repository.save(
      services.map((service) => ({
        appointment_id,
        service_id: service.id,
        provider_id: service.provider_id,
      }))
    );
  }
}
