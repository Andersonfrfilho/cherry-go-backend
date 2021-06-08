import { inject, injectable } from "tsyringe";

import { CreateDocumentsUsersServiceDTO } from "@modules/accounts/dtos";
import { IUsersRepository } from "@modules/accounts/repositories/IUsersRepository";
import { ImagesRepositoryInterface } from "@modules/images/repositories/ImagesRepository.interface";
import { IStorageProvider } from "@shared/container/providers/StorageProvider/IStorageProvider";
import { AppError } from "@shared/errors/AppError";

@injectable()
class CreateDocumentsUsersService {
  constructor(
    @inject("UsersRepository")
    private usersRepository: IUsersRepository,
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
    // pegar o id usuário
    const user = await this.usersRepository.findByIdWithDocument(user_id);

    const [document_front, document_verse] = user.documents;

    // fazer o upload
    if (document_front) {
      const document_image = await this.imagesRepository.findById(
        document_front.image_id
      );

      await this.storageProvider.delete(document_image.name, "documents");
    }

    const name = await this.storageProvider.save(document_file, "documents");

    const image = await this.imagesRepository.create({ name });
    console.log(image);
    // await this.usersRepository.create(user);
    // salvar imagem
    // salvar id_imagem, id_usuario, value

    // const user = await this.usersRepository.findById(user_id);

    // if (!user) {
    //   throw new AppError({ message: "User not exist!" });
    // }

    // await this.usersRepository.createTagsUsers({ tags, user_id });
  }
}
export { CreateDocumentsUsersService };
