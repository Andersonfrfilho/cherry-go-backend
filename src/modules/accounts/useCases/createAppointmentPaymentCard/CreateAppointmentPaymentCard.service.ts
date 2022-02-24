import { inject, injectable } from "tsyringe";

import { Provider } from "@modules/accounts/infra/typeorm/entities/Provider";
import { Service } from "@modules/accounts/infra/typeorm/entities/Services";
import { ProvidersRepositoryInterface } from "@modules/accounts/repositories/Providers.repository.interface";
import { UsersRepositoryInterface } from "@modules/accounts/repositories/Users.repository.interface";
import { UsersTokensRepositoryInterface } from "@modules/accounts/repositories/UsersTokens.repository.interface";
import { Address } from "@modules/addresses/infra/typeorm/entities/Address";
import { AppointmentsRepositoryInterface } from "@modules/appointments/repositories/Appointments.repository.interface";
import { CacheProviderInterface } from "@shared/container/providers/CacheProvider/Cache.provider.interface";
import { DateProviderInterface } from "@shared/container/providers/DateProvider/Date.provider.interface";
import { PaymentProviderInterface } from "@shared/container/providers/PaymentProvider/Payment.provider.interface";
import { AppError } from "@shared/errors/AppError";
import { BAD_REQUEST, NOT_FOUND, UNAUTHORIZED } from "@shared/errors/constants";

interface StageCacheData {
  route: string;
  children: string;
  params_name: string;
}
interface HourStartEnd {
  hour: string;
  selected: boolean;
  day: string;
  available: boolean;
  date: number;
  available_period: boolean;
  time_blocked: boolean;
}
interface Hour {
  start: HourStartEnd;
  end: HourStartEnd;
}
interface LocalDetails {
  local_initial: Address;
  local_destination: Address;
  local_destination_identification: string;
  distance_between: any;
}
interface Local {
  id: string;
  provider_id: string;
  address_id: string;
  active: boolean;
  amount: string;
  details: LocalDetails;
  address: Address;
}
interface AppointmentCacheData {
  provider: Provider;
  services: Service[];
  stage: StageCacheData;
  necessaryMilliseconds: number;
  hours: Hour;

  local: Local;
}

@injectable()
export class CreateAppointmentPaymentCardService {
  constructor(
    @inject("UsersRepository")
    private usersRepository: UsersRepositoryInterface,
    @inject("ProvidersRepository")
    private providersRepository: ProvidersRepositoryInterface,
    @inject("AppointmentsRepository")
    private appointmentsRepository: AppointmentsRepositoryInterface,
    @inject("CacheProvider")
    private cacheProvider: CacheProviderInterface,
    @inject("DateProvider")
    private dateProvider: DateProviderInterface
  ) {}
  async execute(id: string): Promise<void> {
    const client = await this.usersRepository.findById(id);

    if (!client) {
      throw new AppError(NOT_FOUND.USER_DOES_NOT_EXIST);
    }

    const appointment_stage_cache =
      await this.cacheProvider.recover<AppointmentCacheData>(
        `clients:${client.id}:appointment`
      );

    const provider = await this.providersRepository.findById({ id });

    if (!provider) {
      throw new AppError(NOT_FOUND.PROVIDER_DOES_NOT_EXIST);
    }

    const { hours } = appointment_stage_cache;

    const isBeforeNow = this.dateProvider.compareIfBefore(
      new Date(hours.start.date),
      this.dateProvider.dateNow()
    );
    console.log(this.dateProvider.dateNow(), new Date(hours.start.date));
    if (isBeforeNow) {
      throw new AppError(BAD_REQUEST.APPOINTMENT_INITIAL_DATE_BEFORE_DATE_NOW);
    }

    // const appointment = await this.appointmentsRepository.create({
    //   initial_date: new Date(hours.start.date),
    //   final_date: new Date(hours.end.date),
    //   confirm: false,
    // });

    // console.log(appointment);
  }
}
