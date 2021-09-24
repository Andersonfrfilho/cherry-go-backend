import { classToClass } from "class-transformer";
import { inject, injectable } from "tsyringe";

import {
  PaginationPropsDTO,
  PaginationResponsePropsDTO,
} from "@modules/accounts/dtos/repositories/PaginationProps.dto";
import { TagsRepositoryInterface } from "@modules/tags/repositories/Tags.repository.interface";
import { CacheProviderInterface } from "@shared/container/providers/CacheProvider/Cache.provider.interface";

@injectable()
export class GetTagsService {
  constructor(
    @inject("TagsRepository")
    private tagsRepository: TagsRepositoryInterface,
    @inject("CacheProvider")
    private cacheProvider: CacheProviderInterface
  ) {}
  async execute({
    order,
    page,
    per_page,
    fields,
    user_id,
  }: PaginationPropsDTO): Promise<PaginationResponsePropsDTO> {
    let tags;

    await this.cacheProvider.invalidate("tags");

    if (!order && !!page && !!per_page && !fields && !!user_id) {
      tags = await this.cacheProvider.recover("tags");

      if (tags) {
        return classToClass(tags);
      }
    }

    tags = await this.tagsRepository.findTagsWithPages({
      fields,
      order,
      page,
      per_page,
      user_id,
    });

    if (!order && !!page && !!per_page && !fields && !!user_id) {
      await this.cacheProvider.save("tags", tags);
    }

    return tags;
  }
}
