import { getRepository, Repository } from "typeorm";

import { CreateUserProfileImageRepositoryDTO } from "@modules/accounts/dtos";
import { UpdateImageDocumentUserImageRepositoryDTO } from "@modules/accounts/dtos/repositories/UpdateImageDocumentUserImage.repository.dto";
import { UserProfileImage } from "@modules/accounts/infra/typeorm/entities/UserProfileImage";
import { UserProfileImageRepositoryInterface } from "@modules/accounts/repositories/UserProfileImage.repository.interface";

export class UserProfileImageRepository
  implements UserProfileImageRepositoryInterface {
  private repository: Repository<UserProfileImage>;

  constructor() {
    this.repository = getRepository(UserProfileImage);
  }

  async create({
    image_id,
    user_id,
  }: CreateUserProfileImageRepositoryDTO): Promise<void> {
    const user_image_profile = this.repository.create({
      image_id,
      user_id,
    });
    await this.repository.save(user_image_profile);
  }

  async findById(id: string): Promise<UserProfileImage> {
    return this.repository.findOne(id);
  }

  async updateImage({
    id,
    image_id,
  }: UpdateImageDocumentUserImageRepositoryDTO): Promise<void> {
    await this.repository.update(id, { image_id });
  }

  async deleteById(id: string): Promise<void> {
    await this.repository.delete(id);
  }
}
