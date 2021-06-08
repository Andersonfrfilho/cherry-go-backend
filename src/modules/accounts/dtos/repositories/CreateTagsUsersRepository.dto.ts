import { Tag } from "@modules/tags/infra/typeorm/entities/Tag";

interface CreateTagsUsersRepositoryDTO {
  tags: Partial<Tag>[];
  user_id: string;
}
export { CreateTagsUsersRepositoryDTO };
