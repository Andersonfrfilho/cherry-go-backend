import { Provider } from "@modules/accounts/infra/typeorm/entities/Provider";
import { Appointment } from "@modules/appointments/infra/typeorm/entities/Appointment";

interface ProviderAppointment extends Provider {
  appointments: Appointment[];
}
export interface AuthenticateUserProviderServiceResponseDTO {
  provider: ProviderAppointment;
  token: string;
  refresh_token: string;
}
