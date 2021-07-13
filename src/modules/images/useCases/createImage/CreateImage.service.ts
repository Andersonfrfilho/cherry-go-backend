import { inject, injectable } from "tsyringe";

import { CreateImageServiceDTO } from "@modules/images/dtos";
import { Image } from "@modules/images/infra/typeorm/entities/Image";
import { ImagesRepositoryInterface } from "@modules/images/repositories/Images.repository.interface";
import { StorageProviderInterface } from "@shared/container/providers/StorageProvider/Storage.provider.interface";

@injectable()
export class CreateImageService {
  constructor(
    @inject("StorageProvider")
    private storageProvider: StorageProviderInterface,
    @inject("ImagesRepository")
    private imagesRepository: ImagesRepositoryInterface
  ) {}
  async execute({ name }: CreateImageServiceDTO): Promise<Image> {
    const image_name = await this.storageProvider.save(name, "images");

    const image = await this.imagesRepository.create({
      name: image_name,
    });

    return image;
  }
}
