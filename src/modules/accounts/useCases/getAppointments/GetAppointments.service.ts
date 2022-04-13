import Stripe from "stripe";
import { inject, injectable } from "tsyringe";

import { AppointmentCacheData } from "@modules/accounts/dtos/services/CreateAppointmentPaymentCard.service.dto";
import { Appointment } from "@modules/accounts/dtos/services/SetStageAppointmentClient.dto";
import { LOCALS_TYPES_ENUM } from "@modules/accounts/enums/LocalsTypes.enum";
import { Provider } from "@modules/accounts/infra/typeorm/entities/Provider";
import { Service } from "@modules/accounts/infra/typeorm/entities/Services";
import { ProvidersRepositoryInterface } from "@modules/accounts/repositories/Providers.repository.interface";
import { UsersRepositoryInterface } from "@modules/accounts/repositories/Users.repository.interface";
import { UsersTokensRepositoryInterface } from "@modules/accounts/repositories/UsersTokens.repository.interface";
import { TRANSPORT_TYPES_ENUM } from "@modules/addresses/enums/TransportsTypes.enum";
import { Address } from "@modules/addresses/infra/typeorm/entities/Address";
import { AppointmentsRepositoryInterface } from "@modules/appointments/repositories/Appointments.repository.interface";
import { CacheProviderInterface } from "@shared/container/providers/CacheProvider/Cache.provider.interface";
import { DateProviderInterface } from "@shared/container/providers/DateProvider/Date.provider.interface";
import { PaymentProviderInterface } from "@shared/container/providers/PaymentProvider/Payment.provider.interface";
import { AppError } from "@shared/errors/AppError";
import { BAD_REQUEST, NOT_FOUND, UNAUTHORIZED } from "@shared/errors/constants";

@injectable()
export class GetAppointmentsService {
  constructor(
    @inject("UsersRepository")
    private usersRepository: UsersRepositoryInterface
  ) {}
  async execute(id: string): Promise<[Appointment[], number]> {
    const client = await this.usersRepository.findById(id);

    if (!client) {
      throw new AppError(NOT_FOUND.USER_DOES_NOT_EXIST);
    }

    return this.usersRepository.getAllClientAppointments({ id: client.id });
  }
}
