import { CreateUserProfileImageRepositoryDTO } from "@modules/accounts/dtos";

import { UpdateImageDocumentUserImageRepositoryDTO } from "../dtos/repositories/UpdateImageDocumentUserImageRepository.dto";
import { UserProfileImage } from "../infra/typeorm/entities/UserProfileImage";

export interface UserProfileImageRepositoryInterface {
  create(data: CreateUserProfileImageRepositoryDTO): Promise<void>;
  findById(id: string): Promise<UserProfileImage>;
  updateImage({
    id,
    image_id,
  }: UpdateImageDocumentUserImageRepositoryDTO): Promise<void>;
  deleteById(id: string): Promise<void>;
}
