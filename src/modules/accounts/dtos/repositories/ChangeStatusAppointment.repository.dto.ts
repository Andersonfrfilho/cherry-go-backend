import { STATUS_PROVIDERS_APPOINTMENT } from "@modules/appointments/enums/StatusProvidersAppointment.enum";

export interface ChangeStatusAppointmentRepositoryDTO {
  provider_id: string;
  appointment_id: string;
  status: STATUS_PROVIDERS_APPOINTMENT;
}
