import { container } from "tsyringe";

import "@shared/container/providers";

import { DocumentsUsersImageRepository } from "@modules/accounts/infra/typeorm/repositories/DocumentUserImageRepository";
import { PhonesRepository } from "@modules/accounts/infra/typeorm/repositories/PhonesRepository";
import { TypesUsersRepository } from "@modules/accounts/infra/typeorm/repositories/TypesUsersRepository";
import { UserProfileImageRepository } from "@modules/accounts/infra/typeorm/repositories/UserProfileImageRepository";
import { UsersRepository } from "@modules/accounts/infra/typeorm/repositories/UsersRepository";
import { UsersTokensRepository } from "@modules/accounts/infra/typeorm/repositories/UsersTokensRepository";
import { DocumentsUserImageRepositoryInterface } from "@modules/accounts/repositories/DocumentsUserImageRepository.interface";
import { IPhonesRepository } from "@modules/accounts/repositories/IPhonesRepository";
import { IUsersTokensRepository } from "@modules/accounts/repositories/IUsersTokensRepository";
import { ITypesUsersRepository } from "@modules/accounts/repositories/IUsersTypesRepository";
import { UserProfileImageRepositoryInterface } from "@modules/accounts/repositories/UserProfileImageRepository.interface";
import { UsersRepositoryInterface } from "@modules/accounts/repositories/UsersRepository.interface";
import { ImagesRepository } from "@modules/images/infra/typeorm/repositories/ImagesRepository";
import { ImagesRepositoryInterface } from "@modules/images/repositories/ImagesRepository.interface";
import { NotificationsRepository } from "@modules/notifications/infra/typeorm/repositories/NotificationsRepository";
import { INotificationsRepository } from "@modules/notifications/repositories/INotificationsRepository";
import { TagsRepository } from "@modules/tags/infra/typeorm/repositories/TagsRepository";
import { TagsRepositoryInterface } from "@modules/tags/repositories/TagsRepository.interface";

container.registerSingleton<UsersRepositoryInterface>(
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

container.registerSingleton<INotificationsRepository>(
  "NotificationsRepository",
  NotificationsRepository
);
