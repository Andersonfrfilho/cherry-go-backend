import { CreateImageRepositoryDTO } from "@modules/images/dtos";
import { Image } from "@modules/images/infra/typeorm/entities/Image";

export interface ImagesRepositoryInterface {
  findById(id: string): Promise<Image>;
  create(data: CreateImageRepositoryDTO): Promise<Image>;
  deleteById(id: string): Promise<void>;
}
