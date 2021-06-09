import { CreateDocumentsUserImageRepositoryDTO } from "@modules/accounts/dtos";
import { DocumentUserImage } from "@modules/accounts/infra/typeorm/entities/DocumentUserImage";

import { UpdateImageDocumentUserImageRepositoryDTO } from "../dtos/repositories/UpdateImageDocumentUserImageRepository.dto";

export interface DocumentsUserImageRepositoryInterface {
  create(data: CreateDocumentsUserImageRepositoryDTO): Promise<void>;
  findById(id: string): Promise<DocumentUserImage>;
  updateImage({
    id,
    image_id,
  }: UpdateImageDocumentUserImageRepositoryDTO): Promise<void>;
  deleteById(id: string): Promise<void>;
}
