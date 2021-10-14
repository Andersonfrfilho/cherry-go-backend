import { inject, injectable } from "tsyringe";

import { DeletePhotosProviderServiceDTO } from "@modules/accounts/dtos/services/DeletePhotosProvider.service.dto";
import { UpdatePhotosProviderServiceDTO } from "@modules/accounts/dtos/services/UpdatePhotosProvider.service.dto";
import { ProvidersImagesRepositoryInterface } from "@modules/accounts/repositories/ProvidersImages.repository.interface";
import { UsersRepositoryInterface } from "@modules/accounts/repositories/Users.repository.interface";
import { AppError } from "@shared/errors/AppError";
import { NOT_FOUND } from "@shared/errors/constants";

@injectable()
export class DeletePhotosProviderService {
  constructor(
    @inject("UsersRepository")
    private usersRepository: UsersRepositoryInterface,
    @inject("ProvidersImagesRepository")
    private providersImagesRepositoryInterface: ProvidersImagesRepositoryInterface
  ) {}
  async execute({
    images_providers,
    provider_id,
  }: DeletePhotosProviderServiceDTO): Promise<void> {
    const provider = await this.usersRepository.findByIdWithProfileImage(
      provider_id
    );

    if (!provider) {
      throw new AppError(NOT_FOUND.PROVIDER_DOES_NOT_EXIST);
    }

    const images_providers_database = await this.providersImagesRepositoryInterface.findByProviderId(
      provider_id
    );

    if (
      !images_providers_database.every((image_provider) =>
        images_providers.some((image) => image.id === image_provider.id)
      )
    ) {
      throw new AppError(NOT_FOUND.IMAGE_NOT_CONTAIN_FOR_PROVIDER);
    }

    const functionChangePositions = images_providers.map(
      async (image_provider) => {
        return this.providersImagesRepositoryInterface.deleteImage(
          image_provider
        );
      }
    );

    await Promise.all(functionChangePositions);
  }
}
