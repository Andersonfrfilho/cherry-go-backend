import { classToClass } from "class-transformer";
import { injectable } from "tsyringe";

import { DAYS_WEEK_ENUM } from "@modules/accounts/enums/DaysProviders.enum";
import { HOURS_DAYS_ENUM } from "@modules/accounts/enums/HoursProviders.enum";

interface ResponseDTO {
  days: { day: string }[];
  hours: Array<string>;
}
@injectable()
export class GetAvailabilitiesOptionsProviderWorkService {
  constructor() {}
  async execute(): Promise<ResponseDTO> {
    const days = Object.keys(DAYS_WEEK_ENUM).map((element) => ({
      day: element,
    }));
    const hours = HOURS_DAYS_ENUM;
    return classToClass({
      days,
      hours,
    });
  }
}
