import { getRepository, Repository } from "typeorm";

import { CreateUserRepositoryDTO } from "@modules/tags/dtos";
import { Tag } from "@modules/tags/infra/typeorm/entities/Tag";
import { TagsRepositoryInterface } from "@modules/tags/repositories/Tags.repository.interface";

export class TagsRepository implements TagsRepositoryInterface {
  private repository: Repository<Tag>;

  constructor() {
    this.repository = getRepository(Tag);
  }
  async create({
    image_id,
    name,
    description,
    active,
  }: CreateUserRepositoryDTO): Promise<Tag> {
    const tag = await this.repository.save({
      image_id,
      name,
      description,
      active,
    });

    return this.repository.create(tag);
  }
  async findByName(name: string): Promise<Tag> {
    return this.repository.findOne({ where: { name } });
  }
}
