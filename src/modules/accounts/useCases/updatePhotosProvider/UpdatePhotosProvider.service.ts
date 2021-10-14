import { inject, injectable } from "tsyringe";

import { UpdatePhotosProviderServiceDTO } from "@modules/accounts/dtos/services/UpdatePhotosProvider.service.dto";
import { ProvidersImagesRepositoryInterface } from "@modules/accounts/repositories/ProvidersImages.repository.interface";
import { UsersRepositoryInterface } from "@modules/accounts/repositories/Users.repository.interface";
import { AppError } from "@shared/errors/AppError";
import { NOT_FOUND } from "@shared/errors/constants";

@injectable()
export class UpdatePhotosProviderService {
  constructor(
    @inject("UsersRepository")
    private usersRepository: UsersRepositoryInterface,
    @inject("ProvidersImagesRepository")
    private providersImagesRepositoryInterface: ProvidersImagesRepositoryInterface
  ) {}
  async execute({
    images,
    provider_id,
  }: UpdatePhotosProviderServiceDTO): Promise<void> {
    const provider = await this.usersRepository.findByIdWithProfileImage(
      provider_id
    );

    if (!provider) {
      throw new AppError(NOT_FOUND.PROVIDER_DOES_NOT_EXIST);
    }

    const images_providers = await this.providersImagesRepositoryInterface.findByProviderId(
      provider_id
    );

    if (
      !images_providers.every((image_provider) =>
        images.some((image) => image.id === image_provider.id)
      )
    ) {
      throw new AppError(NOT_FOUND.IMAGE_NOT_CONTAIN_FOR_PROVIDER);
    }

    const functionChangePositions = images.map(async (image) => {
      return this.providersImagesRepositoryInterface.updatePositionImage({
        id: image.id,
        position: image.position,
      });
    });

    await Promise.all(functionChangePositions);
  }
}
