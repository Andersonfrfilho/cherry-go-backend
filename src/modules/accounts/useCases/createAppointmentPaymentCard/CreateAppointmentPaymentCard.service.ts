import Stripe from "stripe";
import { inject, injectable } from "tsyringe";

import { AppointmentCacheData } from "@modules/accounts/dtos/services/CreateAppointmentPaymentCard.service.dto";
import { LOCALS_TYPES_ENUM } from "@modules/accounts/enums/localsTypes.enum";
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
    private dateProvider: DateProviderInterface,
    @inject("PaymentProvider")
    private paymentProvider: PaymentProviderInterface
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

    const {
      provider: provider_cache,
      localType: local_type_cache,
      local: local_cache,
      transportType: transport_type_cache,
      hours: hours_cache,
      services: services_cache,
      paymentType: payment_type_cache,
      amountTotal: amount,
      card: card_cache,
    } = appointment_stage_cache;

    const is_before_now = this.dateProvider.compareIfBefore(
      new Date(hours_cache.start.date),
      this.dateProvider.dateNow()
    );

    if (is_before_now) {
      throw new AppError(BAD_REQUEST.APPOINTMENT_INITIAL_DATE_BEFORE_DATE_NOW);
    }
    const provider_found = await this.providersRepository.findById({
      id: provider_cache.id,
      relations: [
        "services",
        "locals_types",
        "locals",
        "transports_types",
        "payments_types",
      ],
    });
    if (!provider_found) {
      throw new AppError(NOT_FOUND.PROVIDER_DOES_NOT_EXIST);
    }
    const services_found = services_cache.every((service_cache_param) =>
      provider_found.services.some(
        (service_provider_found_param) =>
          service_provider_found_param.id === service_cache_param.id &&
          service_provider_found_param.active
      )
    );

    if (!services_found) {
      throw new AppError(NOT_FOUND.SERVICE_PROVIDER_DOES_NOT_EXIST);
    }

    const services_stripe = services_cache.map((service) => ({
      id: service.id,
      stripe: service.details.stripe,
    }));

    const stripe_create_order_itens_data = [...services_stripe];

    const {
      results: { opens, confirmed },
    } = await this.providersRepository.findAppointments({
      provider_id: provider_found.id,
      created_date: new Date(),
    });
    const unavailable_hours = this.dateProvider.unavailableHours([
      ...opens,
      ...confirmed,
    ]);
    const [hour_start, minutes_start] = hours_cache.start.hour.split(":");
    const date_start_compare = this.dateProvider.formattedDateToCompare(
      hour_start,
      minutes_start
    );
    const [hour_end, minutes_end] = hours_cache.end.hour.split(":");
    const date_end_compare = this.dateProvider.formattedDateToCompare(
      hour_end,
      minutes_end
    );
    const available_hour_found = unavailable_hours.every((hour) => {
      const [hour_unavailable_start, minutes_unavailable_start] =
        hour.initial_date.split(":");
      const date_unavailable_start_compare =
        this.dateProvider.formattedDateToCompare(
          hour_unavailable_start,
          minutes_unavailable_start
        );
      const [hour_unavailable_final, minutes_unavailable_final] =
        hour.final_date.split(":");

      const date_final_compare = this.dateProvider.formattedDateToCompare(
        hour_unavailable_final,
        minutes_unavailable_final
      );

      return (
        !this.dateProvider.compareIfBetweenEqual(
          date_start_compare,
          date_unavailable_start_compare,
          date_final_compare
        ) ||
        !this.dateProvider.compareIfBetweenEqual(
          date_end_compare,
          date_unavailable_start_compare,
          date_final_compare
        )
      );
    });
    if (!available_hour_found) {
      throw new AppError(BAD_REQUEST.PROVIDER_HOUR_PERIOD_NOT_AVAILABLE);
    }
    const local_type_found = provider_found.locals_types.find(
      (local_type_param) =>
        local_type_param.id === local_type_cache.id && local_type_param.active
    );
    if (!local_type_found) {
      throw new AppError(BAD_REQUEST.PROVIDER_LOCAL_TYPE_NOT_AVAILABLE);
    }
    let local_found;

    if (local_type_found.local_type === LOCALS_TYPES_ENUM.provider) {
      local_found = provider_found.locals.some(
        (local_param) => local_param.id === local_cache.id && local_param.active
      );
      stripe_create_order_itens_data.push({
        id: local_cache.id,
        stripe: local_cache.details.stripe,
        amount: Number(local_cache.amount),
      });
    } else {
      local_found = client.addresses.some(
        (address_param) => address_param.id === local_cache.id
      );
    }
    if (!local_found) {
      throw new AppError(BAD_REQUEST.PROVIDER_LOCAL_NOT_AVAILABLE);
    }

    const transport_type_found = provider_found.transports_types.some(
      (transport_type_param) =>
        transport_type_param.id === transport_type_cache.id &&
        transport_type_param.transport_type.active &&
        transport_type_param.active
    );
    if (!transport_type_found) {
      throw new AppError(BAD_REQUEST.PROVIDER_TRANSPORT_NOT_AVAILABLE);
    }

    const payment_type_found = provider_found.payments_types.some(
      (payment_type_param) =>
        payment_type_param.id === payment_type_cache.id &&
        payment_type_param.active
    );

    if (!payment_type_found) {
      throw new AppError(BAD_REQUEST.PROVIDER_PAYMENT_TYPE_NOT_AVAILABLE);
    }

    // const appointment = await this.appointmentsRepository.transactionCreate({
    //   initial_date: new Date(hours_cache.start.date),
    //   final_date: new Date(hours_cache.end.date),
    //   confirm: false,
    //   address: local_cache,
    //   client_id: client.id,
    //   current_amount: amount,
    //   original_amount: amount,
    //   discount_amount: 0,
    //   increment_amount: 0,
    //   payment_type: payment_type_cache,
    //   provider_id: provider_found.id,
    //   services: services_cache,
    //   transport_type: transport_type_cache,
    // });

    if (
      transport_type_cache.transport_type.name === TRANSPORT_TYPES_ENUM.PROVIDER
    ) {
      stripe_create_order_itens_data.push({
        id: transport_type_cache.id,
        stripe: transport_type_cache.details.stripe,
        amount: Number(transport_type_cache.amount),
      });
    }

    const order_stripes = await this.paymentProvider.createOrder<
      Stripe.Response<Stripe.Order>
    >({
      itens: stripe_create_order_itens_data,
      customer_stripe_id: client.details.stripe.customer.id,
    });
    console.log(order_stripes);
    // const order_stripes = await this.paymentProvider.paymentOrder({
    //   order_stripe_id: order_stripes.id,
    //   card: JSON.parse(card_cache),
    // });
  }
}
