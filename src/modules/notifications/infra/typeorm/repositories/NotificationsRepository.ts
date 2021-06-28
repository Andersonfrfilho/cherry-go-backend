import { getMongoRepository, MongoRepository } from "typeorm";

import { CreateNotificationRepositoryDTO } from "@modules/notifications/dtos";
import { Notification } from "@modules/notifications/infra/typeorm/schemas/Notification";
import { NotificationsRepositoryInterface } from "@modules/notifications/repositories/NotificationsRepository.interface";

class NotificationsRepository implements NotificationsRepositoryInterface {
  private repository: MongoRepository<Notification>;

  constructor() {
    this.repository = getMongoRepository(Notification, "mongo");
  }
  async create({
    content,
    receipt_id,
  }: CreateNotificationRepositoryDTO): Promise<Notification> {
    const notification = this.repository.create({ content, receipt_id });

    await this.repository.save(notification);

    return notification;
  }
}

export { NotificationsRepository };
