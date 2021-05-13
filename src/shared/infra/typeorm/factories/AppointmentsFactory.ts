import faker from "faker";

import { Appointment } from "@modules/appointments/infra/typeorm/entities/Appointments";
import { ParametersFactoryDTO } from "@shared/infra/typeorm/dtos/Factory.dto";

class AppointmentsFactory {
  public generate({
    quantity = 1,
  }: ParametersFactoryDTO): Omit<Appointment, "id">[] {
    return Array.from(
      { length: quantity },
      (): Omit<Appointment, "id"> => ({
        confirm: faker.datatype.boolean(),
        date: faker.date.future(),
      })
    );
  }
}
export { AppointmentsFactory };
