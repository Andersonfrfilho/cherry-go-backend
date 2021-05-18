import { container } from "tsyringe";

import { IDateProvider } from "@shared/container/providers/DateProvider/IDateProvider";
import { DateFnsProvider } from "@shared/container/providers/DateProvider/implementations/DateFnsProvider";
import { DayjsDateProvider } from "@shared/container/providers/DateProvider/implementations/DayjsDateProvider";

const dateProvider = {
  dayJs: DayjsDateProvider,
  dateFns: DateFnsProvider,
};

container.registerSingleton<IDateProvider>(
  "DateProvider",
  dateProvider[`${process.env.DATE_PROVIDER}`]
);
