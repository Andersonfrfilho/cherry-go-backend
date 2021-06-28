import { inject, injectable } from "tsyringe";

import { CreateImageProfileUserServiceDTO } from "@modules/accounts/dtos";
import { UserProfileImageRepositoryInterface } from "@modules/accounts/repositories/UserProfileImageRepository.interface";
import { UsersRepositoryInterface } from "@modules/accounts/repositories/UsersRepository.interface";
import { ImagesRepositoryInterface } from "@modules/images/repositories/ImagesRepository.interface";
import { StorageProviderInterface } from "@shared/container/providers/StorageProvider/StorageProvider.interface";

@injectable()
class CreateProfileImageUserService {
  constructor(
    @inject("UsersRepository")
    private usersRepository: UsersRepositoryInterface,
    @inject("StorageProvider")
    private storageProvider: StorageProviderInterface,
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

      await this.storageProvider.delete(image_profile.image.name, "profiles");

      await this.imagesRepository.deleteById(image_profile.image_id);
    }

    const name = await this.storageProvider.save(
      image_profile_name,
      "profiles"
    );

    const image = await this.imagesRepository.create({ name });

    await this.userProfileImageRepository.create({
      image_id: image.id,
      user_id,
    });
  }
}
export { CreateProfileImageUserService };
