import { container } from "tsyringe";

import { DateProviderInterface } from "@shared/container/providers/DateProvider/DateProvider.interface";
import { DateFnsProvider } from "@shared/container/providers/DateProvider/implementations/DateFnsProvider";

const dateProvider = {
  dateFns: DateFnsProvider,
};

container.registerSingleton<DateProviderInterface>(
  "DateProvider",
  dateProvider[`${process.env.DATE_PROVIDER}`]
);
