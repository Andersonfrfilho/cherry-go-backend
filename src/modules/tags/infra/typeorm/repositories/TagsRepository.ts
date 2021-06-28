import { getRepository, Repository } from "typeorm";

import { CreateUserDTO } from "@modules/tags/dtos";
import { Tag } from "@modules/tags/infra/typeorm/entities/Tag";
import { TagsRepositoryInterface } from "@modules/tags/repositories/TagsRepository.interface";

class TagsRepository implements TagsRepositoryInterface {
  private repository: Repository<Tag>;

  constructor() {
    this.repository = getRepository(Tag);
  }
  async create({
    image_id,
    name,
    description,
    active,
  }: CreateUserDTO): Promise<Tag> {
    const tag = this.repository.create({
      image_id,
      name,
      description,
      active,
    });

    await this.repository.save(tag);

    return tag;
  }
  async findByName(name: string): Promise<Tag> {
    return this.repository.findOne({ where: { name } });
  }
}
export { TagsRepository };
