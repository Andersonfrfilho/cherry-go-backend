import faker from "faker";
import { getConnection, MigrationInterface } from "typeorm";

import { Provider } from "@modules/accounts/infra/typeorm/entities/Providers";
import { User } from "@modules/accounts/infra/typeorm/entities/User";
import { Appointment } from "@modules/appointments/infra/typeorm/entities/Appointments";
import { AppointmentsFactory } from "@shared/infra/typeorm/factories";

export class CreateAppointment1620963956718 implements MigrationInterface {
  public async up(): Promise<void> {
    const clients = (await getConnection("seed")
      .getRepository(User)
      .createQueryBuilder("users")
      .leftJoinAndSelect(
        "users.types",
        "types_users",
        "types_users.name = :category_name",
        { category_name: "client" }
      )
      .getMany()) as User[];

    const providers = (await getConnection("seed")
      .getRepository(Provider)
      .createQueryBuilder("users")
      .leftJoinAndSelect(
        "users.types",
        "types_users",
        "types_users.name = :category_name",
        { category_name: "provider" }
      )
      .getMany()) as Provider[];

    const appointmentsFactory = new AppointmentsFactory();

    const appointmentsFactoryList = appointmentsFactory.generate({
      quantity: faker.datatype.number({
        min: clients.length,
        max: clients.length * 2,
      }),
    });

    const appointments_factories_saves = await getConnection("seed")
      .getRepository("appointments")
      .save(appointmentsFactoryList);

    const appointments_list = (await getConnection("seed")
      .getRepository("appointments")
      .find(appointments_factories_saves)) as Appointment[];

    const usersAppointments = clients.map((user) => ({
      ...user,
      appointments: Array.from({
        length: faker.datatype.number({
          min: 1,
          max: appointments_list.length,
        }),
      }).map((_, index) => appointments_list[index]),
    }));

    await getConnection("seed").getRepository(User).save(usersAppointments);

    const providersAppointments = providers.map((user) => ({
      ...user,
      appointments: Array.from({
        length: faker.datatype.number({
          min: 1,
          max: appointments_list.length,
        }),
      }).map((_, index) => appointments_list[index]),
    }));

    await getConnection("seed")
      .getRepository(Provider)
      .save(providersAppointments);
  }

  public async down(): Promise<void> {
    await getConnection("seed")
      .getRepository("appointments_providers")
      .delete({});
    await getConnection("seed").getRepository("appointments_users").delete({});
    await getConnection("seed").getRepository("appointments").delete({});
  }
}
