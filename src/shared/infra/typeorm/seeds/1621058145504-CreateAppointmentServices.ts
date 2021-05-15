import { getConnection, MigrationInterface, QueryRunner } from "typeorm";

import { Provider } from "@modules/accounts/infra/typeorm/entities/Providers";
import { Appointment } from "@modules/appointments/infra/typeorm/entities/Appointments";

export class CreateAppointmentServices1621058145504
  implements MigrationInterface {
  public async up(): Promise<void> {
    const appointments = (await getConnection("seed")
      .getRepository(Appointment)
      .createQueryBuilder("appointments")
      .leftJoinAndSelect("appointments.providers", "providers")
      .getMany()) as Appointment[];
    console.log(JSON.stringify(appointments));
    // const appointmentsFactoryList = appointments.forEach((appointment) => {
    //   const { providers } = appointment;

    //   providers.map(async (provider) => {
    //     const providers_services = (await getConnection("seed")
    //       .getRepository(Provider)
    //       .createQueryBuilder("providers")
    //       .leftJoinAndSelect("providers.services", "services")
    //       .getMany()) as Provider[];
    //     return providers_services;
    //   });
    // });

    // const appointments_factories_saves = await getConnection("seed")
    //   .getRepository("appointments")
    //   .save(appointmentsFactoryList);

    // const appointments_list = (await getConnection("seed")
    //   .getRepository("appointments")
    //   .find(appointments_factories_saves)) as Appointment[];

    // const usersAppointments = clients.map((user) => ({
    //   ...user,
    //   appointments: Array.from({
    //     length: faker.datatype.number({
    //       min: 1,
    //       max: appointments_list.length,
    //     }),
    //   }).map((_, index) => appointments_list[index]),
    // }));

    // await getConnection("seed").getRepository(User).save(usersAppointments);

    // const providersAppointments = providers.map((user) => ({
    //   ...user,
    //   appointments: Array.from({
    //     length: faker.datatype.number({
    //       min: 1,
    //       max: appointments_list.length,
    //     }),
    //   }).map((_, index) => appointments_list[index]),
    // }));

    // await getConnection("seed")
    //   .getRepository(Provider)
    //   .save(providersAppointments);
  }

  public async down(): Promise<void> {
    await getConnection("seed")
      .getRepository("documents_users_images")
      .delete({});
  }
}
