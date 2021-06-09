import { classToClass } from "class-transformer";
import { inject, injectable } from "tsyringe";

import { CreateDocumentsUsersServiceDTO } from "@modules/accounts/dtos";
import { UserDocumentValue } from "@modules/accounts/enums/UserDocumentValue.enum";
import { DocumentsUserImageRepositoryInterface } from "@modules/accounts/repositories/DocumentsUserImageRepository.interface";
import { IUsersRepository } from "@modules/accounts/repositories/IUsersRepository";
import { ImagesRepositoryInterface } from "@modules/images/repositories/ImagesRepository.interface";
import { IStorageProvider } from "@shared/container/providers/StorageProvider/IStorageProvider";
import { AppError } from "@shared/errors/AppError";

@injectable()
class CreateDocumentsUsersService {
  constructor(
    @inject("UsersRepository")
    private usersRepository: IUsersRepository,
    @inject("DocumentsUsersImageRepository")
    private usersDocumentsRepository: DocumentsUserImageRepositoryInterface,
    @inject("StorageProvider")
    private storageProvider: IStorageProvider,
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

      await this.storageProvider.delete(image_found.name, "documents");

      await this.imagesRepository.deleteById(
        document_side[description].image_id
      );
    }

    const name = await this.storageProvider.save(document_file, "documents");

    const image = await this.imagesRepository.create({ name });

    await this.usersDocumentsRepository.create({
      image_id: image.id,
      user_id,
      value: user.rg,
      description: UserDocumentValue[description],
    });
  }
}
export { CreateDocumentsUsersService };
