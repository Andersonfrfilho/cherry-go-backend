import { container } from "tsyringe";

import "@shared/container/providers";

import { DocumentsUsersImageRepository } from "@modules/accounts/infra/typeorm/repositories/DocumentUserImageRepository";
import { PhonesRepository } from "@modules/accounts/infra/typeorm/repositories/PhonesRepository";
import { ProvidersRepository } from "@modules/accounts/infra/typeorm/repositories/ProvidersRepository";
import { ServicesProvidersRepository } from "@modules/accounts/infra/typeorm/repositories/ServicesProvidersRepository";
import { TypesUsersRepository } from "@modules/accounts/infra/typeorm/repositories/TypesUsersRepository";
import { UserProfileImageRepository } from "@modules/accounts/infra/typeorm/repositories/UserProfileImageRepository";
import { UsersRepository } from "@modules/accounts/infra/typeorm/repositories/UsersRepository";
import { UsersTokensRepository } from "@modules/accounts/infra/typeorm/repositories/UsersTokensRepository";
import { DocumentsUserImageRepositoryInterface } from "@modules/accounts/repositories/DocumentsUserImageRepository.interface";
import { PhonesRepositoryInterface } from "@modules/accounts/repositories/PhonesRepository.interface";
import { ProvidersRepositoryInterface } from "@modules/accounts/repositories/ProvidersRepository.interface";
import { ServicesProvidersRepositoryInterface } from "@modules/accounts/repositories/ServicesProvidersRepository.interface";
import { TypesUsersRepositoryInterface } from "@modules/accounts/repositories/TypesUsersRepository.interface";
import { UserProfileImageRepositoryInterface } from "@modules/accounts/repositories/UserProfileImageRepository.interface";
import { UsersRepositoryInterface } from "@modules/accounts/repositories/UsersRepository.interface";
import { UsersTokensRepositoryInterface } from "@modules/accounts/repositories/UsersTokensRepository.interface";
import { AppointmentsProvidersServicesRepository } from "@modules/appointments/infra/typeorm/repositories/AppointmentProviderServiceRepository";
import { AppointmentsAddressesRepository } from "@modules/appointments/infra/typeorm/repositories/AppointmentsAddressesRepository";
import { AppointmentsProvidersRepository } from "@modules/appointments/infra/typeorm/repositories/AppointmentsProvidersRepository";
import { AppointmentsUsersRepository } from "@modules/appointments/infra/typeorm/repositories/AppointmentsUsersRepository";
import { AppointmentsUsersTransactionsRepository } from "@modules/appointments/infra/typeorm/repositories/AppointmentsUsersTransactionsRepository";
import { AppointmentTransactionsItensRepository } from "@modules/appointments/infra/typeorm/repositories/AppointmentTransactionsItensRepository";
import { AppointmentsAddressesRepositoryInterface } from "@modules/appointments/repositories/AppointmentsAddressesRepository.interface";
import { AppointmentsProvidersRepositoryInterface } from "@modules/appointments/repositories/AppointmentsProvidersRepository.interface";
import { AppointmentsProvidersServicesRepositoryInterface } from "@modules/appointments/repositories/AppointmentsProvidersServicesRepository.interface";
import { AppointmentsUsersRepositoryInterface } from "@modules/appointments/repositories/AppointmentsUsersRepository.interface";
import { AppointmentsUsersTransactionsRepositoryInterface } from "@modules/appointments/repositories/AppointmentsUsersTransactionsRepository.interface";
import { AppointmentTransactionsItensRepositoryInterface } from "@modules/appointments/repositories/AppointmentTransactionsItensRepository.interface";
import { ImagesRepository } from "@modules/images/infra/typeorm/repositories/ImagesRepository";
import { ImagesRepositoryInterface } from "@modules/images/repositories/ImagesRepository.interface";
import { NotificationsRepository } from "@modules/notifications/infra/typeorm/repositories/NotificationsRepository";
import { NotificationsRepositoryInterface } from "@modules/notifications/repositories/NotificationsRepository.interface";
import { TagsRepository } from "@modules/tags/infra/typeorm/repositories/TagsRepository";
import { TagsRepositoryInterface } from "@modules/tags/repositories/TagsRepository.interface";
import { TransportsRepository } from "@modules/transports/infra/typeorm/repositories/TransportsRepository";
import { TransportsRepositoryInterface } from "@modules/transports/repositories/TransportsRepository.interface";

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
