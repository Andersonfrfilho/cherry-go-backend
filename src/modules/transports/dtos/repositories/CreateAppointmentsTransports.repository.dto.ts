import { CreateAppointmentProviders } from "@modules/appointments/dtos/services/CreateAppointment.service.dto";

export interface CreateAppointmentsTransportsRepositoryDTO {
  providers: Partial<CreateAppointmentProviders>[];
  appointment_id: string;
  origin_address_id: string;
}
