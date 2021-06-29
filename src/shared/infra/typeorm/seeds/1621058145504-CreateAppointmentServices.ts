import faker from "faker";
import { getConnection, MigrationInterface } from "typeorm";

import { Appointment } from "@modules/appointments/infra/typeorm/entities/Appointment";
import { AppointmentProviderService } from "@modules/appointments/infra/typeorm/entities/AppointmentsProvidersServices";

export class CreateAppointmentServices1621058145504
  implements MigrationInterface {
  public async up(): Promise<void> {
    // const appointments = (await getConnection("seeds")
    //   .getRepository(Appointment)
    //   .find({
    //     relations: ["providers", "providers.services"],
    //   })) as Appointment[];
    // const services_appointments = appointments
    //   .map((appointment) =>
    //     appointment.providers
    //       .map((provider) =>
    //         Array.from({
    //           length: faker.datatype.number({
    //             min: 1,
    //             max: provider.services.length,
    //           }),
    //         }).map((_, index) => ({
    //           appointment_id: appointment.id,
    //           provider_id: provider.id,
    //           service_id: provider.services[index].id,
    //         }))
    //       )
    //       .reduce((accumulator, currentValue) => [
    //         ...accumulator,
    //         ...currentValue,
    //       ])
    //   )
    //   .reduce((accumulator, currentValue) => [...accumulator, ...currentValue]);
    // await getConnection("seeds")
    //   .getRepository(AppointmentProviderService)
    //   .save(services_appointments);
  }

  public async down(): Promise<void> {
    // await getConnection("seeds")
    //   .getRepository("appointments_providers_services")
    //   .delete({});
  }
}
