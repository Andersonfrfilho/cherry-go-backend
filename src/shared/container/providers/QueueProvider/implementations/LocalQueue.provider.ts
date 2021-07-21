import { Kafka } from "kafkajs";

import { QueueSendMessageDTO } from "@shared/container/providers/QueueProvider/dtos";
import { QueueProviderInterface } from "@shared/container/providers/QueueProvider/Queue.provider.interface";

export class LocalQueueProvider implements QueueProviderInterface {
  async sendMessage(data: QueueSendMessageDTO): Promise<boolean> {
    return true;
  }
}
