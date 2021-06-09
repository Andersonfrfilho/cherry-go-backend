import { getRepository, Repository } from "typeorm";

import { CreateDocumentsUserImageRepositoryDTO } from "@modules/accounts/dtos";
import { UpdateImageDocumentUserImageRepositoryDTO } from "@modules/accounts/dtos/repositories/UpdateImageDocumentUserImageRepository.dto";
import { DocumentUserImage } from "@modules/accounts/infra/typeorm/entities/DocumentUserImage";
import { DocumentsUserImageRepositoryInterface } from "@modules/accounts/repositories/DocumentsUserImageRepository.interface";

class DocumentsUsersImageRepository
  implements DocumentsUserImageRepositoryInterface {
  private repository: Repository<DocumentUserImage>;

  constructor() {
    this.repository = getRepository(DocumentUserImage);
  }

  async create({
    image_id,
    user_id,
    description,
    value,
  }: CreateDocumentsUserImageRepositoryDTO): Promise<void> {
    const document_user_image = this.repository.create({
      image_id,
      user_id,
      description,
      value,
    });
    await this.repository.save(document_user_image);
  }

  async findById(id: string): Promise<DocumentUserImage> {
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
export { DocumentsUsersImageRepository };
