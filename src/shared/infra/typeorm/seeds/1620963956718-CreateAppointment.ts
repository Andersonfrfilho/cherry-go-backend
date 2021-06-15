import faker from "faker";
import { getConnection, MigrationInterface } from "typeorm";

import { Provider } from "@modules/accounts/infra/typeorm/entities/Provider";
import { User } from "@modules/accounts/infra/typeorm/entities/User";
import { Appointment } from "@modules/appointments/infra/typeorm/entities/Appointments";
import { AppointmentsFactory } from "@shared/infra/typeorm/factories";

export class CreateAppointment1620963956718 implements MigrationInterface {
  public async up(): Promise<void> {
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

    const providers = (await getConnection("seeds")
      .getRepository(Provider)
      .createQueryBuilder("users")
      .leftJoinAndSelect(
        "users.types",
        "types_users",
        "types_users.name = :category_name",
        { category_name: "provider" }
      )
      .getMany()) as Provider[];

    const appointments_factory = new AppointmentsFactory();

    const appointments_factory_list = appointments_factory.generate({
      quantity: faker.datatype.number({
        min: clients.length,
        max: clients.length * 2,
      }),
    });

    const appointments_factories_saves = await getConnection("seeds")
      .getRepository("appointments")
      .save(appointments_factory_list);

    const appointments_list = (await getConnection("seeds")
      .getRepository("appointments")
      .find(appointments_factories_saves)) as Appointment[];

    const users_appointments = clients.map((user) => ({
      ...user,
      appointments: Array.from({
        length: faker.datatype.number({
          min: 1,
          max: appointments_list.length,
        }),
      }).map((_, index) => appointments_list[index]),
    }));

    await getConnection("seeds").getRepository(User).save(users_appointments);

    const providers_appointments = providers.map((user) => ({
      ...user,
      appointments: Array.from({
        length: faker.datatype.number({
          min: 1,
          max: appointments_list.length,
        }),
      }).map((_, index) => appointments_list[index]),
    }));

    await getConnection("seeds")
      .getRepository(Provider)
      .save(providers_appointments);
  }

  public async down(): Promise<void> {
    await getConnection("seeds")
      .getRepository("appointments_providers")
      .delete({});
    await getConnection("seeds").getRepository("appointments_users").delete({});
    await getConnection("seeds").getRepository("appointments").delete({});
  }
}
