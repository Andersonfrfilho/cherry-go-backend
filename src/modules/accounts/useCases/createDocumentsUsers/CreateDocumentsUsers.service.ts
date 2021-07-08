import { inject, injectable } from "tsyringe";

import { CreateDocumentsUsersServiceDTO } from "@modules/accounts/dtos";
import { USER_DOCUMENT_VALUE_ENUM } from "@modules/accounts/enums/UserDocumentValue.enum";
import { DocumentsUserImageRepositoryInterface } from "@modules/accounts/repositories/DocumentsUserImage.repository.interface";
import { UsersRepositoryInterface } from "@modules/accounts/repositories/Users.repository.interface";
import { ImagesRepositoryInterface } from "@modules/images/repositories/Images.repository.interface";
import { STORAGE_TYPE_FOLDER_ENUM } from "@shared/container/providers/StorageProvider/enums/StorageTypeFolder.enum";
import { StorageProviderInterface } from "@shared/container/providers/StorageProvider/Storage.provider.interface";

@injectable()
export class CreateDocumentsUsersService {
  constructor(
    @inject("UsersRepository")
    private usersRepository: UsersRepositoryInterface,
    @inject("DocumentsUsersImageRepository")
    private usersDocumentsRepository: DocumentsUserImageRepositoryInterface,
    @inject("StorageProvider")
    private storageProvider: StorageProviderInterface,
    @inject("ImagesRepository")
    private imagesRepository: ImagesRepositoryInterface
  ) {}
  async execute({
    document_file,
    user_id,
    description,
  }: CreateDocumentsUsersServiceDTO): Promise<void> {
    const user = await this.usersRepository.findByIdWithDocument(user_id);

    const [front, back] = user.documents;

    const document_side = {
      FRONT: front,
      BACK: back,
    };

    if (document_side[description]) {
      const image_found = await this.imagesRepository.findById(
        document_side[description].image_id
      );
      await this.usersDocumentsRepository.deleteById(
        document_side[description].id
      );

      await this.storageProvider.delete(
        image_found.name,
        STORAGE_TYPE_FOLDER_ENUM.DOCUMENTS
      );

      await this.imagesRepository.deleteById(
        document_side[description].image_id
      );
    }

    const name = await this.storageProvider.save(
      document_file,
      STORAGE_TYPE_FOLDER_ENUM.DOCUMENTS
    );

    const image = await this.imagesRepository.create({ name });

    await this.usersDocumentsRepository.create({
      image_id: image.id,
      user_id,
      value: user.rg,
      description: USER_DOCUMENT_VALUE_ENUM[description],
    });
  }
}
