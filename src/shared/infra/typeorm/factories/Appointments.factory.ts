import { faker } from "@faker-js/faker/locale/pt_BR";
import { Appointment } from "@modules/appointments/infra/typeorm/entities/Appointment";
import { ParametersFactoryDTO } from "@shared/infra/typeorm/dtos/Factory.dto";

interface ICreateAppointmentParametersFactoryDTO
  extends Partial<Appointment>,
    ParametersFactoryDTO {}

export class AppointmentsFactory {
  public generate({
    quantity = 1,
    id,
    initial_date,
    final_date,
    confirm,
  }: ICreateAppointmentParametersFactoryDTO): Partial<Appointment>[] {
    return Array.from(
      { length: quantity },
      (): Partial<Appointment> => ({
        id: id ? faker.datatype.uuid() : undefined,
        confirm:
          typeof confirm === "boolean" ? confirm : faker.datatype.boolean(),
        initial_date: initial_date || faker.date.future(),
        final_date: final_date || faker.date.future(),
      })
    );
  }
}
