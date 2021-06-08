import { inject, injectable } from "tsyringe";

import { CreateTagsServiceDTO } from "@modules/tags/dtos";
import { TagsRepositoryInterface } from "@modules/tags/repositories/TagsRepository.interface";
import { AppError } from "@shared/errors/AppError";

@injectable()
class CreateTagsService {
  constructor(
    @inject("TagsRepository")
    private tagsRepository: TagsRepositoryInterface
  ) {}
  async execute({
    active,
    description,
    name,
    image_id,
  }: CreateTagsServiceDTO): Promise<Tag> {
    const tag = await this.tagsRepository.findByName(name);

    if (tag) {
      throw new AppError({ message: "Tag already exist!" });
    }

    const tag_saved = await this.tagsRepository.create({
      active,
      description,
      name,
      image_id,
    });

    return tag_saved;
  }
}
export { CreateTagsService };
