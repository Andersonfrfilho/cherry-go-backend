import { container } from "tsyringe";

import "@shared/container/providers";

import { DocumentsUsersImageRepository } from "@modules/accounts/infra/typeorm/repositories/DocumentUserImage.repository";
import { PhonesRepository } from "@modules/accounts/infra/typeorm/repositories/Phones.repository";
import { ProvidersRepository } from "@modules/accounts/infra/typeorm/repositories/Providers.repository";
import { ServicesProvidersRepository } from "@modules/accounts/infra/typeorm/repositories/ServicesProviders.repository";
import { TypesUsersRepository } from "@modules/accounts/infra/typeorm/repositories/TypesUsers.repository";
import { UserProfileImageRepository } from "@modules/accounts/infra/typeorm/repositories/UserProfileImage.repository";
import { UsersRepository } from "@modules/accounts/infra/typeorm/repositories/Users.repository";
import { UsersTokensRepository } from "@modules/accounts/infra/typeorm/repositories/UsersTokens.repository";
import { DocumentsUserImageRepositoryInterface } from "@modules/accounts/repositories/DocumentsUserImageRepository.interface";
import { PhonesRepositoryInterface } from "@modules/accounts/repositories/Phones.repository.interface";
import { ProvidersRepositoryInterface } from "@modules/accounts/repositories/Providers.repository.interface";
import { ServicesProvidersRepositoryInterface } from "@modules/accounts/repositories/ServicesProviders.repository.interface";
import { TypesUsersRepositoryInterface } from "@modules/accounts/repositories/TypesUsersRepository.interface";
import { UserProfileImageRepositoryInterface } from "@modules/accounts/repositories/UserProfileImage.repository.interface";
import { UsersRepositoryInterface } from "@modules/accounts/repositories/Users.repository.interface";
import { UsersTokensRepositoryInterface } from "@modules/accounts/repositories/UsersTokens.repository.interface";
import { AppointmentsProvidersServicesRepository } from "@modules/appointments/infra/typeorm/repositories/AppointmentProviderService.repository";
import { AppointmentsAddressesRepository } from "@modules/appointments/infra/typeorm/repositories/AppointmentsAddresses.repository";
import { AppointmentsProvidersRepository } from "@modules/appointments/infra/typeorm/repositories/AppointmentsProviders.repository";
import { AppointmentsUsersRepository } from "@modules/appointments/infra/typeorm/repositories/AppointmentsUsers.repository";
import { AppointmentsUsersTransactionsRepository } from "@modules/appointments/infra/typeorm/repositories/AppointmentsUsersTransactions.repository";
import { AppointmentTransactionsItensRepository } from "@modules/appointments/infra/typeorm/repositories/AppointmentTransactionsItens.repository";
import { AppointmentsAddressesRepositoryInterface } from "@modules/appointments/repositories/AppointmentsAddresses.repository.interface";
import { AppointmentsProvidersRepositoryInterface } from "@modules/appointments/repositories/AppointmentsProviders.repository.interface";
import { AppointmentsProvidersServicesRepositoryInterface } from "@modules/appointments/repositories/AppointmentsProvidersServices.repository.interface";
import { AppointmentsUsersRepositoryInterface } from "@modules/appointments/repositories/AppointmentsUsers.repository.interface";
import { AppointmentsUsersTransactionsRepositoryInterface } from "@modules/appointments/repositories/AppointmentsUsersTransactions.repository.interface";
import { AppointmentTransactionsItensRepositoryInterface } from "@modules/appointments/repositories/AppointmentTransactionsItens.repository.interface";
import { ImagesRepository } from "@modules/images/infra/typeorm/repositories/Images.repository";
import { ImagesRepositoryInterface } from "@modules/images/repositories/Images.repository.interface";
import { NotificationsRepository } from "@modules/notifications/infra/typeorm/repositories/Notifications.repository";
import { NotificationsRepositoryInterface } from "@modules/notifications/repositories/NotificationsRepository.interface";
import { TagsRepository } from "@modules/tags/infra/typeorm/repositories/Tags.repository";
import { TagsRepositoryInterface } from "@modules/tags/repositories/Tags.repository.interface";
import { TransportsRepository } from "@modules/transports/infra/typeorm/repositories/Transports.repository";
import { TransportsRepositoryInterface } from "@modules/transports/repositories/Transports.repository.interface";

container.registerSingleton<ProvidersRepositoryInterface>(
  "ProvidersRepository",
  ProvidersRepository
);

container.registerSingleton<UsersRepositoryInterface>(
  "UsersRepository",
  UsersRepository
);

container.registerSingleton<TypesUsersRepositoryInterface>(
  "UsersTypeRepository",
  TypesUsersRepository
);

container.registerSingleton<PhonesRepositoryInterface>(
  "PhonesRepository",
  PhonesRepository
);

container.registerSingleton<UsersTokensRepositoryInterface>(
  "UsersTokensRepository",
  UsersTokensRepository
);

container.registerSingleton<TagsRepositoryInterface>(
  "TagsRepository",
  TagsRepository
);

container.registerSingleton<ImagesRepositoryInterface>(
  "ImagesRepository",
  ImagesRepository
);

container.registerSingleton<DocumentsUserImageRepositoryInterface>(
  "DocumentsUsersImageRepository",
  DocumentsUsersImageRepository
);

container.registerSingleton<UserProfileImageRepositoryInterface>(
  "UserProfileImageRepository",
  UserProfileImageRepository
);

container.registerSingleton<AppointmentsUsersRepositoryInterface>(
  "AppointmentsUsersRepository",
  AppointmentsUsersRepository
);

container.registerSingleton<AppointmentsProvidersRepositoryInterface>(
  "AppointmentsProvidersRepository",
  AppointmentsProvidersRepository
);

container.registerSingleton<AppointmentsAddressesRepositoryInterface>(
  "AppointmentsAddressesRepository",
  AppointmentsAddressesRepository
);

container.registerSingleton<ServicesProvidersRepositoryInterface>(
  "ServicesRepository",
  ServicesProvidersRepository
);

container.registerSingleton<TransportsRepositoryInterface>(
  "TransportsRepository",
  TransportsRepository
);

container.registerSingleton<AppointmentsUsersTransactionsRepositoryInterface>(
  "AppointmentsUsersTransactionsRepository",
  AppointmentsUsersTransactionsRepository
);

container.registerSingleton<AppointmentTransactionsItensRepositoryInterface>(
  "AppointmentTransactionsItensRepository",
  AppointmentTransactionsItensRepository
);

container.registerSingleton<AppointmentsProvidersServicesRepositoryInterface>(
  "AppointmentsProvidersServicesRepository",
  AppointmentsProvidersServicesRepository
);

container.registerSingleton<NotificationsRepositoryInterface>(
  "NotificationsRepository",
  NotificationsRepository
);
