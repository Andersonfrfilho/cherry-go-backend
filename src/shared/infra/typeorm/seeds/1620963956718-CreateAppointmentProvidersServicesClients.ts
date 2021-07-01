import faker from "faker";
import { getConnection, MigrationInterface } from "typeorm";

import { Provider } from "@modules/accounts/infra/typeorm/entities/Provider";
import { User } from "@modules/accounts/infra/typeorm/entities/User";
import { Appointment } from "@modules/appointments/infra/typeorm/entities/Appointment";
import { AppointmentsFactory } from "@shared/infra/typeorm/factories";

export class CreateAppointmentProvidersServicesClients1620963956718
  implements MigrationInterface {
  public async up(): Promise<void> {
    const providers = await getConnection("seeds")
      .getRepository(Provider)
      .createQueryBuilder("users")
      .leftJoinAndSelect("users.services", "services")
      .leftJoinAndSelect(
        "users.types",
        "types_users",
        "types_users.name = :category_name",
        { category_name: "provider" }
      )
      .getMany();

    const clients = (await getConnection("seeds")
      .getRepository(User)
      .createQueryBuilder("users")
      .leftJoinAndSelect(
        "users.types",
        "types_users",
        "types_users.name = :category_name",
        { category_name: "client" }
      )
      .getMany()) as User[];

    const appointments_factory = new AppointmentsFactory();

    const appointments_factory_list = appointments_factory.generate({
      quantity: faker.datatype.number({
        min: providers.length,
        max: providers.length * providers.length,
      }),
    });

    const appointments: Appointment[] = await getConnection("seeds")
      .getRepository("appointments")
      .save(appointments_factory_list);
    const related_services_clients = [];
    let appointment_index = 0;
    const related_appointments_providers = [];
    while (appointment_index < appointments.length) {
      let provider_index = 0;
      while (
        provider_index < providers.length &&
        !!appointments[appointment_index]
      ) {
        const service_random_quantities = faker.datatype.number({
          min: 1,
          max: providers[provider_index].services.length - 1,
        });

        let service_index = 0;

        while (service_index < service_random_quantities) {
          related_services_clients.push({
            provider_id: providers[provider_index].id,
            appointment_id: appointments[appointment_index].id,
            service_id: providers[provider_index].services[service_index].id,
          });
          service_index += 1;
        }

        related_appointments_providers.push({
          provider_id: providers[provider_index].id,
          appointment_id: appointments[appointment_index].id,
          active: true,
        });
        appointment_index += 1;
        provider_index += 1;
      }
    }

    await getConnection("seeds")
      .getRepository("appointments_providers")
      .save(related_appointments_providers);

    await getConnection("seeds")
      .getRepository("appointments_providers_services")
      .save(related_services_clients);

    appointment_index = 0;
    const related_appointments_clients = [];
    while (appointment_index < appointments.length) {
      let client_index = 0;
      while (
        client_index < clients.length &&
        !!appointments[appointment_index]
      ) {
        related_appointments_clients.push({
          user_id: clients[client_index].id,
          appointment_id: appointments[appointment_index].id,
          active: true,
        });
        appointment_index += 1;
        client_index += 1;
      }
    }

    await getConnection("seeds")
      .getRepository("appointments_users")
      .save(related_appointments_clients);
  }

  public async down(): Promise<void> {
    await getConnection("seeds")
      .getRepository("appointments_providers_services")
      .delete({});
    await getConnection("seeds")
      .getRepository("appointments_providers")
      .delete({});
    await getConnection("seeds").getRepository("appointments_users").delete({});
    await getConnection("seeds").getRepository("appointments").delete({});
  }
}
