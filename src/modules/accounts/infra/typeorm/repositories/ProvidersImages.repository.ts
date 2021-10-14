import { getRepository, In, Repository } from "typeorm";

import { CreateProvidersImagesRepositoryDTO } from "@modules/accounts/dtos/repositories/CreateProvidersImages.repository.dto";
import { UpdatePositionProvidersImagesRepositoryDTO } from "@modules/accounts/dtos/repositories/UpdatePositionProvidersImages.repository.dto";
import { Provider } from "@modules/accounts/infra/typeorm/entities/Provider";
import { ProvidersImagesRepositoryInterface } from "@modules/accounts/repositories/ProvidersImages.repository.interface";
import { Image } from "@modules/images/infra/typeorm/entities/Image";

import { ProviderImage } from "../entities/ProviderImage";

export class ProvidersImagesRepository
  implements ProvidersImagesRepositoryInterface {
  private repository: Repository<ProviderImage>;

  constructor() {
    this.repository = getRepository(ProviderImage);
  }
  async deleteImage(data: ProviderImage): Promise<void> {
    await this.repository.delete(data.id);
  }

  async updatePositionImage({
    id,
    position,
  }: UpdatePositionProvidersImagesRepositoryDTO): Promise<void> {
    await this.repository.update(id, { position });
  }

  async findByProviderId(provider_id: string): Promise<ProviderImage[]> {
    const provider_images = await this.repository.find({
      where: { provider_id },
    });
    return provider_images;
  }

  async create({
    image_id,
    position,
    provider_id,
    rating,
  }: CreateProvidersImagesRepositoryDTO): Promise<void> {
    await this.repository.save({
      image_id,
      position,
      provider_id,
      rating,
    });
  }
}
