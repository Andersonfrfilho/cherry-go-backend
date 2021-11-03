import { isAfter, isBefore } from "date-fns";
import { inject, injectable } from "tsyringe";

import { CreateProviderTimesAvailabilityServiceDTO } from "@modules/accounts/dtos";
import { ProviderAvailabilityTime } from "@modules/accounts/infra/typeorm/entities/ProviderAvailabilityTime";
import { ProvidersRepositoryInterface } from "@modules/accounts/repositories/Providers.repository.interface";
import { DateProviderInterface } from "@shared/container/providers/DateProvider/Date.provider.interface";
import { AppError } from "@shared/errors/AppError";
import { BAD_REQUEST, NOT_FOUND } from "@shared/errors/constants";

@injectable()
class CreateProviderTimesAvailabilitiesService {
  constructor(
    @inject("ProvidersRepository")
    private providersRepository: ProvidersRepositoryInterface,
    @inject("DateProvider")
    private dateProvider: DateProviderInterface
  ) {}
  async execute({
    provider_id,
    end_hour,
    start_hour,
  }: CreateProviderTimesAvailabilityServiceDTO): Promise<
    ProviderAvailabilityTime[]
  > {
    const startDate = new Date(2000, 0, 1);
    const [startDateHour, startDateMinute] = start_hour.split(":");
    startDate.setHours(Number(startDateHour), Number(startDateMinute), 0, 0);

    const endDate = new Date(2000, 0, 1);
    const [endDateHour, endDateMinute] = end_hour.split(":");
    endDate.setHours(Number(endDateHour), Number(endDateMinute), 0, 0);

    if (!this.dateProvider.compareIfBefore(startDate, endDate)) {
      throw new AppError(BAD_REQUEST.INITIAL_DATE_GREATER_THAN_END_DATE);
    }

    const provider = await this.providersRepository.findById(provider_id);

    if (!provider) {
      throw new AppError(NOT_FOUND.PROVIDER_DOES_NOT_EXIST);
    }

    const hours = await this.providersRepository.findByProviderHoursAvailable(
      provider_id
    );

    const excludesIntervalsHours = hours.filter((period) => {
      const dateStartCompare = new Date(2000, 0, 1);
      const [
        hourStartFormatted,
        minuteStartFormatted,
      ] = period.start_time.split(":");
      dateStartCompare.setHours(
        Number(hourStartFormatted),
        Number(minuteStartFormatted),
        0,
        0
      );
      const dateEndCompare = new Date(2000, 0, 1);
      const [hourEndFormatted, minuteEndFormatted] = period.end_time.split(":");
      dateEndCompare.setHours(
        Number(hourEndFormatted),
        Number(minuteEndFormatted),
        0,
        0
      );

      return (
        // quando as datas podem ser iguais - deixa pro final
        (this.dateProvider.compareIfEqual(startDate, dateStartCompare) &&
          this.dateProvider.compareIfEqual(endDate, dateEndCompare)) ||
        // quando as novas datas englobam as outras
        (this.dateProvider.compareIfBefore(startDate, dateStartCompare) &&
          this.dateProvider.compareIfAfter(endDate, dateEndCompare)) ||
        // quando a data inicial é igual mas a final é maior
        (this.dateProvider.compareIfEqual(startDate, dateStartCompare) &&
          this.dateProvider.compareIfAfter(endDate, dateEndCompare)) ||
        // quando a data inicial é antes mas a final é igual
        (this.dateProvider.compareIfBefore(startDate, dateStartCompare) &&
          this.dateProvider.compareIfEqual(endDate, dateEndCompare))
      );
    });

    if (excludesIntervalsHours.length > 0) {
      console.log("add hour - exclude");
      await this.providersRepository.excludeProviderHourAvailable(
        excludesIntervalsHours.map((hour) => hour.id)
      );
    }

    const modifyIntervalStartHour =
      hours.every((period) => {
        const dateStartCompare = new Date(2000, 0, 1);
        const [
          hourStartFormatted,
          minuteStartFormatted,
        ] = period.start_time.split(":");
        dateStartCompare.setHours(
          Number(hourStartFormatted),
          Number(minuteStartFormatted),
          0,
          0
        );

        return !this.dateProvider.compareIfEqual(startDate, dateStartCompare);
      }) &&
      hours.find((period) => {
        const dateStartCompare = new Date(2000, 0, 1);
        const [
          hourStartFormatted,
          minuteStartFormatted,
        ] = period.start_time.split(":");
        dateStartCompare.setHours(
          Number(hourStartFormatted),
          Number(minuteStartFormatted),
          0,
          0
        );
        const dateEndCompare = new Date(2000, 0, 1);
        const [hourEndFormatted, minuteEndFormatted] = period.end_time.split(
          ":"
        );
        dateEndCompare.setHours(
          Number(hourEndFormatted),
          Number(minuteEndFormatted),
          0,
          0
        );

        return (
          this.dateProvider.compareIfBefore(startDate, dateStartCompare) &&
          !this.dateProvider.compareIfEqual(startDate, dateStartCompare) &&
          !this.dateProvider.compareIfAfter(endDate, dateEndCompare)
        );
      });

    if (modifyIntervalStartHour) {
      modifyIntervalStartHour.start_time = start_hour;
      await this.providersRepository.updateProviderHourAvailable(
        modifyIntervalStartHour
      );
    }
    // const modifyIntervalEndHour =
    //   hours.every((period) => {
    //     const dateEndCompare = new Date(2000, 0, 1);
    //     const [hourEndFormatted, minuteEndFormatted] = period.end_time.split(
    //       ":"
    //     );
    //     dateEndCompare.setHours(
    //       Number(hourEndFormatted),
    //       Number(minuteEndFormatted),
    //       0,
    //       0
    //     );
    //     return !this.dateProvider.compareIfEqual(endDate, dateEndCompare);
    //   }) &&
    //   hours.find((period) => {
    //     const dateStartCompare = new Date(2000, 0, 1);
    //     const [
    //       hourStartFormatted,
    //       minuteStartFormatted,
    //     ] = period.start_time.split(":");
    //     dateStartCompare.setHours(
    //       Number(hourStartFormatted),
    //       Number(minuteStartFormatted),
    //       0,
    //       0
    //     );
    //     const dateEndCompare = new Date(2000, 0, 1);
    //     const [hourEndFormatted, minuteEndFormatted] = period.end_time.split(
    //       ":"
    //     );
    //     dateEndCompare.setHours(
    //       Number(hourEndFormatted),
    //       Number(minuteEndFormatted),
    //       0,
    //       0
    //     );
    //     return (
    //       !isBefore(startDate, dateStartCompare) &&
    //       isAfter(endDate, dateEndCompare)
    //     );
    //   });

    // if (modifyIntervalEndHour) {
    //   console.log("add hour - 1");
    //   modifyIntervalEndHour.end_time = end_hour;
    //   await this.providersRepository.updateProviderHourAvailable(
    //     modifyIntervalEndHour
    //   );
    // }
    const add_hour = hours.some((period) => {
      const dateStartCompare = new Date(2000, 0, 1);
      const [
        hourStartFormatted,
        minuteStartFormatted,
      ] = period.start_time.split(":");
      dateStartCompare.setHours(
        Number(hourStartFormatted),
        Number(minuteStartFormatted),
        0,
        0
      );
      const dateEndCompare = new Date(2000, 0, 1);
      const [hourEndFormatted, minuteEndFormatted] = period.end_time.split(":");
      dateEndCompare.setHours(
        Number(hourEndFormatted),
        Number(minuteEndFormatted),
        0,
        0
      );

      return (
        // quando as datas podem ser iguais - deixa pro final
        this.dateProvider.compareIfEqual(startDate, dateStartCompare) &&
        this.dateProvider.compareIfEqual(endDate, dateEndCompare) &&
        // quando as novas datas englobam as outras
        !(
          this.dateProvider.compareIfBefore(startDate, dateStartCompare) &&
          this.dateProvider.compareIfAfter(endDate, dateEndCompare)
        ) &&
        // quando a data inicial é igual mas a final é maior
        !(
          this.dateProvider.compareIfEqual(startDate, dateStartCompare) &&
          this.dateProvider.compareIfAfter(endDate, dateEndCompare)
        ) &&
        // quando a data inicial é antes mas a final é igual
        !(
          this.dateProvider.compareIfBefore(startDate, dateStartCompare) &&
          this.dateProvider.compareIfEqual(endDate, dateEndCompare)
        )
      );
    });

    if (
      !modifyIntervalStartHour &&
      // && !modifyIntervalEndHour
      !add_hour
    ) {
      await this.providersRepository.createTimesAvailable({
        provider_id,
        end_hour,
        start_hour,
      });
    }

    const new_hours = await this.providersRepository.findByProviderHoursAvailable(
      provider_id
    );

    return new_hours;
  }
}
export { CreateProviderTimesAvailabilitiesService };
