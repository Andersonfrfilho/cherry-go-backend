import { inject, injectable } from "tsyringe";

import { config } from "@config/environment";
import { UploadPhotosProviderServiceDTO } from "@modules/accounts/dtos/services/UploadPhotosProvider.service.dto";
import { ProvidersImagesRepositoryInterface } from "@modules/accounts/repositories/ProvidersImages.repository.interface";
import { UsersRepositoryInterface } from "@modules/accounts/repositories/Users.repository.interface";
import { ImagesRepositoryInterface } from "@modules/images/repositories/Images.repository.interface";
import { STORAGE_TYPE_FOLDER_ENUM } from "@shared/container/providers/StorageProvider/enums/StorageTypeFolder.enum";
import { StorageProviderInterface } from "@shared/container/providers/StorageProvider/Storage.provider.interface";
import { AppError } from "@shared/errors/AppError";
import { BAD_REQUEST, NOT_FOUND } from "@shared/errors/constants";

@injectable()
export class UploadPhotosProviderService {
  constructor(
    @inject("UsersRepository")
    private usersRepository: UsersRepositoryInterface,
    @inject("StorageProvider")
    private storageProvider: StorageProviderInterface,
    @inject("ImagesRepository")
    private imagesRepository: ImagesRepositoryInterface,
    @inject("ProvidersImagesRepository")
    private providersImagesRepositoryInterface: ProvidersImagesRepositoryInterface
  ) {}
  async execute({
    images_name,
    provider_id,
  }: UploadPhotosProviderServiceDTO): Promise<void> {
    const provider = await this.usersRepository.findByIdWithProfileImage(
      provider_id
    );
    if (!provider) {
      throw new AppError(NOT_FOUND.PROVIDER_DOES_NOT_EXIST);
    }
    const images_providers = await this.providersImagesRepositoryInterface.findByProviderId(
      provider_id
    );
    if (images_providers.length >= config.providers.max_images_quantity) {
      throw new AppError(BAD_REQUEST.PROVIDER_ALREADY_LIMITS_IMAGES);
    }
    const images_providers_formatted = images_providers
      .sort(
        (imageA, imageB) => Number(imageA.position) - Number(imageB.position)
      )
      .map((photo, index) => ({
        ...photo,
        position: index.toString(),
      }));
    const functionReorganizedPhotos = images_providers_formatted.map(
      async (image_provider) => {
        await this.providersImagesRepositoryInterface.updatePositionImage({
          id: image_provider.id,
          position: image_provider.position,
        });
      }
    );
    await Promise.all(functionReorganizedPhotos);
    const position = images_providers_formatted.length;
    const functionSavePhotos = images_name.map(
      async (photo_filename, index) => {
        const name = await this.storageProvider.save(
          photo_filename,
          STORAGE_TYPE_FOLDER_ENUM.IMAGES
        );
        const image = await this.imagesRepository.create({ name });
        await this.providersImagesRepositoryInterface.create({
          image_id: image.id,
          provider_id,
          position: String(position + index),
        });
      }
    );
    await Promise.all(functionSavePhotos);
  }
}
