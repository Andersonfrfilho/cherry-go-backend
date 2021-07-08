import { QueueSendMessageDTO } from "@shared/container/providers/QueueProvider/dtos";

interface QueueProviderInterface {
  sendMessage(data: QueueSendMessageDTO): Promise<boolean>;
}

export { QueueProviderInterface };
