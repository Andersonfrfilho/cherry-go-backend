import { classToClass } from "class-transformer";
import { inject, injectable } from "tsyringe";
import { v4 as uuidV4 } from "uuid";

import { config } from "@config/environment";
import { CreateImageProfileUserServiceDTO } from "@modules/accounts/dtos";
import { UserProfileImageRepository } from "@modules/accounts/infra/typeorm/repositories/UserProfileImageRepository";
import { IUsersRepository } from "@modules/accounts/repositories/IUsersRepository";
import { IUsersTokensRepository } from "@modules/accounts/repositories/IUsersTokensRepository";
import { UserProfileImageRepositoryInterface } from "@modules/accounts/repositories/UserProfileImageRepository.interface";
import { ImagesRepositoryInterface } from "@modules/images/repositories/ImagesRepository.interface";
import { User } from "@sentry/node";
import { IDateProvider } from "@shared/container/providers/DateProvider/IDateProvider";
import { IHashProvider } from "@shared/container/providers/HashProvider/IHashProvider";
import { ISendMailDTO } from "@shared/container/providers/MailProvider/dtos/ISendMailDTO";
import { MailContent } from "@shared/container/providers/MailProvider/enums/MailType.enum";
import { QueueProviderInterface } from "@shared/container/providers/QueueProvider/QueueProvider.interface";
import { IStorageProvider } from "@shared/container/providers/StorageProvider/IStorageProvider";
import { AppError } from "@shared/errors/AppError";

@injectable()
class CreateProfileImageUserService {
  constructor(
    @inject("UsersRepository")
    private usersRepository: IUsersRepository,
    @inject("StorageProvider")
    private storageProvider: IStorageProvider,
    @inject("ImagesRepository")
    private imagesRepository: ImagesRepositoryInterface,
    @inject("UserProfileImageRepository")
    private userProfileImageRepository: UserProfileImageRepositoryInterface
  ) {}
  async execute({
    image_profile_name,
    user_id,
  }: CreateImageProfileUserServiceDTO): Promise<void> {
    const user = await this.usersRepository.findByIdWithProfileImage(user_id);

    const [image_profile] = user.image_profile;

    if (image_profile) {
      await this.userProfileImageRepository.deleteById(image_profile.id);

      await this.storageProvider.delete(image_profile.image.name, "documents");

      await this.imagesRepository.deleteById(image_profile.image_id);
    }

    const name = await this.storageProvider.save(
      image_profile_name,
      "documents"
    );

    const image = await this.imagesRepository.create({ name });

    await this.userProfileImageRepository.create({
      image_id: image.id,
      user_id,
    });
  }
}
export { CreateProfileImageUserService };
