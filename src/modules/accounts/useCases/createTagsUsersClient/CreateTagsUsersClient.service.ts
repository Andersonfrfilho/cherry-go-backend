import { inject, injectable } from "tsyringe";

import { CreateTagsUsersClientServiceDTO } from "@modules/accounts/dtos";
import { UsersRepositoryInterface } from "@modules/accounts/repositories/Users.repository.interface";
import { TagsRepositoryInterface } from "@modules/tags/repositories/Tags.repository.interface";
import { AppError } from "@shared/errors/AppError";
import { CONFLICT, NOT_FOUND } from "@shared/errors/constants";

@injectable()
class CreateTagsUsersClientService {
  constructor(
    @inject("UsersRepository")
    private usersRepository: UsersRepositoryInterface,
    @inject("TagsRepository")
    private tagsRepository: TagsRepositoryInterface
  ) {}
  async execute({
    client_tags,
    client_tags_exclude,
  }: CreateTagsUsersClientServiceDTO): Promise<void> {
    let tags;
    if (client_tags && client_tags.length > 0) {
      tags = await this.tagsRepository.findByIds(
        client_tags.map((tag) => tag.tag_id)
      );

      if (tags.length !== client_tags.length) {
        throw new AppError(CONFLICT.TAG_CONFLICT_SOME_TAG_NO_EXIST);
      }

      const user = await this.usersRepository.findById(
        client_tags[0].client_id
      );

      if (!user) {
        throw new AppError(NOT_FOUND.USER_DOES_NOT_EXIST);
      }

      const client_tags_for_save = await this.usersRepository.verifyTagsUsersAlreadyNotExist(
        { client_tags }
      );

      if (client_tags_for_save && client_tags_for_save.length > 0) {
        await this.usersRepository.createTagsUsersClient({
          client_tags: client_tags_for_save,
        });
      }
    }

    if (client_tags_exclude && client_tags_exclude.length > 0) {
      tags = await this.tagsRepository.findByIds(
        client_tags_exclude.map((tag) => tag.tag_id)
      );

      if (tags.length !== client_tags_exclude.length) {
        throw new AppError(CONFLICT.TAG_CONFLICT_SOME_TAG_NO_EXIST);
      }

      const user = await this.usersRepository.findById(
        client_tags_exclude[0].client_id
      );

      if (!user) {
        throw new AppError(NOT_FOUND.USER_DOES_NOT_EXIST);
      }
      const client_tags_for_delete = await this.usersRepository.verifyTagsUsersAlreadyExist(
        { client_tags: client_tags_exclude }
      );

      if (client_tags_for_delete && client_tags_for_delete.length > 0) {
        await this.usersRepository.deleteTagsUsersClient({
          client_tags: client_tags_exclude,
        });
      }
    }
  }
}
export { CreateTagsUsersClientService };
