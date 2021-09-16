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
    console.log("#############");
    const user = await this.usersRepository.findByIdWithDocument(user_id);
    console.log("############ - 1");
    const [front, back] = user.documents;
    console.log("############ - 2");

    const document_side = {
      front,
      back,
    };
    console.log("############ - 3");

    if (document_side[description]) {
      console.log("############ - 4");
      const image_found = await this.imagesRepository.findById(
        document_side[description].image_id
      );
      console.log("############ - 5");
      await this.usersDocumentsRepository.deleteById(
        document_side[description].id
      );
      console.log("############ - 6");
      await this.storageProvider.delete(
        image_found.name,
        STORAGE_TYPE_FOLDER_ENUM.DOCUMENTS
      );
      console.log("############ - 6");
      await this.imagesRepository.deleteById(
        document_side[description].image_id
      );
      console.log("############ - 7");
    }

    console.log("############ - 8");
    const name = await this.storageProvider.save(
      document_file,
      STORAGE_TYPE_FOLDER_ENUM.DOCUMENTS
    );

    console.log("############ - 9");
    const image = await this.imagesRepository.create({ name });
    console.log("############ - 10");

    await this.usersDocumentsRepository.create({
      image_id: image.id,
      user_id,
      value: user.cpf,
      description: USER_DOCUMENT_VALUE_ENUM[description],
    });
    console.log("############ - 11");
  }
}
