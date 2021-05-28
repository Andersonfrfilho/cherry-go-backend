import { container } from "tsyringe";

import "@shared/container/providers";

import { PhonesRepository } from "@modules/accounts/infra/typeorm/repositories/PhonesRepository";
import { TypesUsersRepository } from "@modules/accounts/infra/typeorm/repositories/TypesUsersRepository";
import { UsersRepository } from "@modules/accounts/infra/typeorm/repositories/UsersRepository";
import { UsersTokensRepository } from "@modules/accounts/infra/typeorm/repositories/UsersTokensRepository";
import { IPhonesRepository } from "@modules/accounts/repositories/IPhonesRepository";
import { IUsersRepository } from "@modules/accounts/repositories/IUsersRepository";
import { IUsersTokensRepository } from "@modules/accounts/repositories/IUsersTokensRepository";
import { ITypesUsersRepository } from "@modules/accounts/repositories/IUsersTypesRepository";
import { NotificationsRepository } from "@modules/notifications/infra/typeorm/repositories/NotificationsRepository";
import { INotificationsRepository } from "@modules/notifications/repositories/INotificationsRepository";

container.registerSingleton<IUsersRepository>(
  "UsersRepository",
  UsersRepository
);

container.registerSingleton<ITypesUsersRepository>(
  "UsersTypeRepository",
  TypesUsersRepository
);

container.registerSingleton<IPhonesRepository>(
  "PhonesRepository",
  PhonesRepository
);

container.registerSingleton<IUsersTokensRepository>(
  "UsersTokensRepository",
  UsersTokensRepository
);

container.registerSingleton<INotificationsRepository>(
  "NotificationsRepository",
  NotificationsRepository
);
