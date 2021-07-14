import { Tag } from "@modules/tags/infra/typeorm/entities/Tag";

export interface CreateTagUsersServiceDTO {
  tags: Partial<Tag>[];
  user_id: string;
}
