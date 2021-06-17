import { container } from "tsyringe";

import "@shared/container/providers";

import { DocumentsUsersImageRepository } from "@modules/accounts/infra/typeorm/repositories/DocumentUserImageRepository";
import { PhonesRepository } from "@modules/accounts/infra/typeorm/repositories/PhonesRepository";
import { ProvidersRepository } from "@modules/accounts/infra/typeorm/repositories/ProvidersRepository";
import { TypesUsersRepository } from "@modules/accounts/infra/typeorm/repositories/TypesUsersRepository";
import { UserProfileImageRepository } from "@modules/accounts/infra/typeorm/repositories/UserProfileImageRepository";
import { UsersRepository } from "@modules/accounts/infra/typeorm/repositories/UsersRepository";
import { UsersTokensRepository } from "@modules/accounts/infra/typeorm/repositories/UsersTokensRepository";
import { DocumentsUserImageRepositoryInterface } from "@modules/accounts/repositories/DocumentsUserImageRepository.interface";
import { PhonesRepositoryInterface } from "@modules/accounts/repositories/PhonesRepository.interface";
import { ProvidersRepositoryInterface } from "@modules/accounts/repositories/ProvidersRepository.interface";
import { TypesUsersRepositoryInterface } from "@modules/accounts/repositories/TypesUsersRepository.interface";
import { UserProfileImageRepositoryInterface } from "@modules/accounts/repositories/UserProfileImageRepository.interface";
import { UsersRepositoryInterface } from "@modules/accounts/repositories/UsersRepository.interface";
import { UsersTokensRepositoryInterface } from "@modules/accounts/repositories/UsersTokensRepository.interface";
import { ImagesRepository } from "@modules/images/infra/typeorm/repositories/ImagesRepository";
import { ImagesRepositoryInterface } from "@modules/images/repositories/ImagesRepository.interface";
import { NotificationsRepository } from "@modules/notifications/infra/typeorm/repositories/NotificationsRepository";
import { NotificationsRepositoryInterface } from "@modules/notifications/repositories/NotificationsRepository.interface";
import { TagsRepository } from "@modules/tags/infra/typeorm/repositories/TagsRepository";
import { TagsRepositoryInterface } from "@modules/tags/repositories/TagsRepository.interface";

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

container.registerSingleton<NotificationsRepositoryInterface>(
  "NotificationsRepository",
  NotificationsRepository
);
