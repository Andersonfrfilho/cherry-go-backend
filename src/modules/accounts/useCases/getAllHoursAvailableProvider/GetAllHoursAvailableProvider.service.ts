import { inject, injectable } from "tsyringe";

import { config } from "@config/environment";
import { ProviderAddress } from "@modules/accounts/infra/typeorm/entities/ProviderAddress";
import { ProvidersRepositoryInterface } from "@modules/accounts/repositories/Providers.repository.interface";
import { UsersRepositoryInterface } from "@modules/accounts/repositories/Users.repository.interface";
import { DAYS_WEEK_DATE } from "@shared/container/providers/DateProvider/constants/days.constant";
import { DateProviderInterface } from "@shared/container/providers/DateProvider/Date.provider.interface";
import { hours } from "@shared/container/providers/DateProvider/dtos/Hours.dto";
import { AppError } from "@shared/errors/AppError";
import { BAD_REQUEST, NOT_FOUND } from "@shared/errors/constants";

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
  }: ParamsDTO): Promise<hours[]> {
    const user = await this.usersRepository.findById(user_id);

    if (!user) {
      throw new AppError(NOT_FOUND.USER_DOES_NOT_EXIST);
    }

    const provider = await this.providersRepository.findById(provider_id);

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

    const day = this.dateProvider.getDay(this.dateProvider.dateNow());
    const tomorrow = this.dateProvider.getDay(this.dateProvider.addDays(1));

    const unavailable_hours = this.dateProvider.unavailableHours([
      ...opens,
      ...confirmed,
    ]);

    const days_available = days.filter(
      (dayParam) =>
        dayParam.day.toLowerCase() === DAYS_WEEK_DATE[`${day}`].toLowerCase() ||
        dayParam.day.toLowerCase() ===
          DAYS_WEEK_DATE[`${tomorrow}`].toLowerCase()
    );

    if (days_available.length <= 0) {
      throw new AppError(BAD_REQUEST.DAY_NOT_AVAILABLE);
    }

    const available_hours = days_available
      .map((day) =>
        hours.map((hour) => ({
          hour_id: hour.id,
          initial_date: hour.start_time,
          final_date: hour.end_time,
          day: day.day,
        }))
      )
      .reduce((accumulator, currentValue) => [...accumulator, ...currentValue]);

    const reduce_unavailable_hours = this.dateProvider.reduceHours(
      unavailable_hours
    );

    const rest_available_hours = this.dateProvider.availableHours({
      available_hours,
      unavailable_hours: reduce_unavailable_hours,
    });

    return this.dateProvider.filterDurationIntervals({
      hoursParam: rest_available_hours,
      duration,
    });
  }
}
