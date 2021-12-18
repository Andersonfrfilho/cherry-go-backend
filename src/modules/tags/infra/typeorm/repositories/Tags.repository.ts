import { classToClass } from "class-transformer";
import { getRepository, Repository } from "typeorm";

import {
  PaginationPropsDTO,
  PaginationResponsePropsDTO,
} from "@modules/accounts/dtos/repositories/PaginationProps.dto";
import { ClientTag } from "@modules/accounts/infra/typeorm/entities/ClientTag";
import { TagService } from "@modules/accounts/infra/typeorm/entities/ServiceTag";
import { CreateUserRepositoryDTO } from "@modules/tags/dtos";
import { CreateTagsServiceRepositoryDTO } from "@modules/tags/dtos/repositories/CreateTagsServices.repository.dto";
import { Tag } from "@modules/tags/infra/typeorm/entities/Tag";
import { TagsRepositoryInterface } from "@modules/tags/repositories/Tags.repository.interface";

export class TagsRepository implements TagsRepositoryInterface {
  private repository: Repository<Tag>;
  private repository_clients_tags: Repository<ClientTag>;
  private repository_service_tags: Repository<TagService>;

  constructor() {
    this.repository = getRepository(Tag);
    this.repository_clients_tags = getRepository(ClientTag);
    this.repository_service_tags = getRepository(TagService);
  }

  async getTagsByService(service_id: string): Promise<TagService[]> {
    const tags_services = await this.repository_service_tags.find({
      where: { service_id },
    });
    return tags_services;
  }

  async deleteTagsService(tag_service_ids: string[]): Promise<void> {
    await this.repository_service_tags.delete(tag_service_ids);
  }

  async createTagService({
    service_id,
    tags_id,
  }: CreateTagsServiceRepositoryDTO): Promise<void> {
    await this.repository_service_tags.save(
      tags_id.map((tag_id) => ({ tag_id, service_id }))
    );
  }

  async findTagsWithPages({
    fields,
    order,
    page,
    per_page,
    user_id,
  }: PaginationPropsDTO): Promise<PaginationResponsePropsDTO> {
    const page_start = (Number(page) - 1) * Number(per_page);
    const tagsQuery = this.repository
      .createQueryBuilder("foundTags")
      .select(["foundTags.id", "foundTags.name", "foundTags.image"])
      .where({
        active: true,
      })
      .leftJoinAndSelect("foundTags.image", "image");

    if (fields?.name) {
      tagsQuery.andWhere("foundTags.name like :name", {
        name: `%${fields.name}%`,
      });
    }

    if (page_start) {
      tagsQuery.skip(page_start);
    }

    if (Number(per_page)) {
      tagsQuery.take(Number(per_page));
    }

    if (!!order && !!order.property && !!order.ordering) {
      tagsQuery.orderBy(`foundTags.${order.property}`, `${order.ordering}`);
    }

    let [results, total] = await tagsQuery.getManyAndCount();

    if (user_id) {
      const tags_relation = await this.repository_clients_tags.find({
        where: { client_id: user_id },
      });

      results = results.map((tag) => {
        if (tags_relation.some((tag_param) => tag_param.tag_id === tag.id)) {
          return {
            ...tag,
            selected: true,
          };
        }
        return tag;
      });
    }

    return {
      results: classToClass(results),
      total,
    };
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

  async findByIds(ids: string[]): Promise<Tag[]> {
    return this.repository.findByIds(ids);
  }
}
