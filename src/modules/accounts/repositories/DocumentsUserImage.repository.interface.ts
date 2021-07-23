import { CreateDocumentsUserImageRepositoryDTO } from "@modules/accounts/dtos";
import { UpdateImageDocumentUserImageRepositoryDTO } from "@modules/accounts/dtos/repositories/UpdateImageDocumentUserImage.repository.dto";
import { DocumentUserImage } from "@modules/accounts/infra/typeorm/entities/DocumentUserImage";

export interface DocumentsUserImageRepositoryInterface {
  create(data: CreateDocumentsUserImageRepositoryDTO): Promise<void>;
  findById(id: string): Promise<DocumentUserImage>;
  updateImage({
    id,
    image_id,
  }: UpdateImageDocumentUserImageRepositoryDTO): Promise<void>;
  deleteById(id: string): Promise<void>;
}
