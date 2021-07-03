import faker from "faker";
import { getConnection, MigrationInterface } from "typeorm";

import { Provider } from "@modules/accounts/infra/typeorm/entities/Provider";
import { Appointment } from "@modules/appointments/infra/typeorm/entities/Appointment";
import { AppointmentProviderService } from "@modules/appointments/infra/typeorm/entities/AppointmentsProvidersServices";

export class CreateAppointmentServices1621058145504
  implements MigrationInterface {
  public async up(): Promise<void> {
    const providers = await getConnection("seeds")
      .getRepository(Provider)
      .createQueryBuilder("users")
      .leftJoinAndSelect(
        "users.types",
        "types_users",
        "types_users.name = :category_name",
        { category_name: "provider" }
      )
      .getMany();

    const appointments = (await getConnection("seeds")
      .getRepository(Appointment)
      .find()) as Appointment[];

    let related = 0;
    const related_transport_appointment = [];
    while (related < appointments.length && !!providers[related]) {
      related_days_providers.push({
        provider_id: providers[related].id,
        day,
      });

      related += 1;
    }
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
