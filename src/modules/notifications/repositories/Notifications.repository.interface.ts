import { CreateNotificationRepositoryDTO } from "@modules/notifications/dtos";
import { Notification } from "@modules/notifications/infra/typeorm/schemas/Notification";

interface NotificationsRepositoryInterface {
  create(data: CreateNotificationRepositoryDTO): Promise<Notification>;
}
export { NotificationsRepositoryInterface };
