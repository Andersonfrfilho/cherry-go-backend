import { inject, injectable } from "tsyringe";

import { CreateDocumentsUsersServiceDTO } from "@modules/accounts/dtos";
import { IUsersRepository } from "@modules/accounts/repositories/IUsersRepository";
import { IStorageProvider } from "@shared/container/providers/StorageProvider/IStorageProvider";
import { AppError } from "@shared/errors/AppError";

interface IRequest {
  user_id: string;
  avatar_file: string;
}

@injectable()
class CreateDocumentsUsersService {
  constructor(
    @inject("UsersRepository")
    private usersRepository: IUsersRepository,
    @inject("StorageProvider")
    private storageProvider: IStorageProvider
  ) {}
  async execute({
    document_file,
    user_id,
    description,
  }: CreateDocumentsUsersServiceDTO): Promise<void> {
    // pegar o id usuário
    const user = await this.usersRepository.findByIdWithDocument(user_id);
    console.log(user);
    // fazer o upload
    // if (user.avatar) {
    //   await this.storageProvider.delete(user.avatar, "documents");
    // }
    // await this.storageProvider.save(avatar_file, "avatar");

    // user.avatar = avatar_file;

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
