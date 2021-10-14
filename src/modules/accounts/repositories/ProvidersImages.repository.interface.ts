import { CreateProvidersImagesRepositoryDTO } from "../dtos/repositories/CreateProvidersImages.repository.dto";
import { UpdatePositionProvidersImagesRepositoryDTO } from "../dtos/repositories/UpdatePositionProvidersImages.repository.dto";
import { ProviderImage } from "../infra/typeorm/entities/ProviderImage";

export interface ProvidersImagesRepositoryInterface {
  create(data: CreateProvidersImagesRepositoryDTO): Promise<void>;
  findByProviderId(provider_id: string): Promise<ProviderImage[]>;
  updatePositionImage(
    data: UpdatePositionProvidersImagesRepositoryDTO
  ): Promise<void>;
  deleteImage(data: ProviderImage): Promise<void>;
}
