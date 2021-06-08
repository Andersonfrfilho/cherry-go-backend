import { Tag } from "@modules/tags/infra/typeorm/entities/Tag";

interface CreateTagUsersServiceDTO {
  tags: Partial<Tag>[];
  user_id: string;
}
export { CreateTagUsersServiceDTO };
