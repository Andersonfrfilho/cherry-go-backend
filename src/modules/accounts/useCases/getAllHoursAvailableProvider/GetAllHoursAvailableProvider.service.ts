import getDay from "date-fns/getDay";
import { inject, injectable } from "tsyringe";

import { Provider } from "@modules/accounts/infra/typeorm/entities/Provider";
import { ProvidersRepositoryInterface } from "@modules/accounts/repositories/Providers.repository.interface";
import { UsersRepositoryInterface } from "@modules/accounts/repositories/Users.repository.interface";
import { Appointment } from "@modules/appointments/infra/typeorm/entities/Appointment";
import { DAYS_WEEK_DATE } from "@shared/container/providers/DateProvider/constants/days.constant";
import { DateProviderInterface } from "@shared/container/providers/DateProvider/Date.provider.interface";
import { FormattedHoursDays } from "@shared/container/providers/DateProvider/dtos/Hours.dto";
import { AppError } from "@shared/errors/AppError";
import { BAD_REQUEST, NOT_FOUND } from "@shared/errors/constants";
import { orderDaysWeek } from "@utils/orderDaysWeek";

interface ParamsDTO {
  user_id: string;
  provider_id: string;
  duration: number;
}

@injectable()
export class GetAllHoursAvailableProviderService {
  constructor(
    @inject("UsersRepository")
    private usersRepository: UsersRepositoryInterface,
    @inject("ProvidersRepository")
    private providersRepository: ProvidersRepositoryInterface,
    @inject("DateProvider")
    private dateProvider: DateProviderInterface
  ) {}
  async execute({
    user_id,
    provider_id,
    duration,
  }: ParamsDTO): Promise<FormattedHoursDays[]> {
    const user = await this.usersRepository.findById(user_id);

    if (!user) {
      throw new AppError(NOT_FOUND.USER_DOES_NOT_EXIST);
    }

    const provider = await this.providersRepository.findById({
      id: provider_id,
      relations: ["days", "hours"],
    });

    if (!provider) {
      throw new AppError(NOT_FOUND.PROVIDER_DOES_NOT_EXIST);
    }

    const {
      results: { opens, confirmed },
    } = await this.providersRepository.findAppointments({
      provider_id: provider.id,
      created_date: new Date(),
    });

    const { hours } = provider;
    const { days } = provider;

    const days_week_order = orderDaysWeek(days);

    const dateFormattedNow = this.dateProvider.dateNow();
    const dateFormattedTomorrow = this.dateProvider.addDays(1);

    const arrayDateFormatted = [dateFormattedNow, dateFormattedTomorrow];

    const day = this.dateProvider.getDay(dateFormattedNow);
    const tomorrow = this.dateProvider.getDay(dateFormattedTomorrow);

    const appointment_unavailable_hours_now: Appointment = {
      confirm: false,
      initial_date: this.dateProvider.defineHourMinutesSecondsMilliseconds({
        hour: 0,
        milliseconds: 0,
        minutes: 0,
        seconds: 0,
      }),
      final_date: this.dateProvider.dateNow(),
      deleted_at: null,
      id: "appointment-day",
      created_at: this.dateProvider.dateNow(),
      updated_at: null,
    };

    const unavailable_hours = this.dateProvider.unavailableHours([
      ...opens,
      ...confirmed,
      appointment_unavailable_hours_now,
    ]);

    const days_available = days_week_order
      .filter(
        (dayParam) =>
          dayParam.day.toLowerCase() ===
            DAYS_WEEK_DATE[`${day}`].toLowerCase() ||
          dayParam.day.toLowerCase() ===
            DAYS_WEEK_DATE[`${tomorrow}`].toLowerCase()
      )
      .map((dayParam, index) => ({
        ...dayParam,
        date: this.dateProvider.defineHourMinutesSecondsMilliseconds({
          date: arrayDateFormatted[index],
          hour: 0,
          milliseconds: 0,
          minutes: 0,
          seconds: 0,
        }),
      }));

    if (days_available.length <= 0) {
      throw new AppError(BAD_REQUEST.DAY_NOT_AVAILABLE);
    }

    const available_hours = days_available
      .map((dayParam) =>
        hours.map((hour) => {
          return {
            hour_id: hour.id,
            initial_date: hour.start_time,
            final_date: hour.end_time,
            day: dayParam.day,
          };
        })
      )
      .reduce((accumulator, currentValue) => [...accumulator, ...currentValue]);

    const reduce_unavailable_hours =
      this.dateProvider.reduceHours(unavailable_hours);

    const hours_available_formatted_by_period =
      this.dateProvider.formattedByPeriod({
        hours_param: available_hours,
        days: days_available,
        available_hours: true,
      });

    const hours_unavailable_formatted_by_period =
      this.dateProvider.formattedByPeriod({
        hours_param: reduce_unavailable_hours,
        days: days_available,
        available_hours: false,
      });

    const hours_available_by_period = hours_available_formatted_by_period.map(
      (day_hour, indexDay) => {
        return {
          day: day_hour.day,
          hours: day_hour.hours.map((hour, indexHour) => {
            if (!hour) {
              return hour;
            }
            if (
              !hours_unavailable_formatted_by_period[indexDay].hours[indexHour]
                .available
            ) {
              return hours_unavailable_formatted_by_period[indexDay].hours[
                indexHour
              ];
            }
            return hour;
          }),
        };
      }
    );

    return this.dateProvider.unavailableByDuration({
      duration,
      days_hours_formatted: hours_available_by_period,
    });
  }
}
