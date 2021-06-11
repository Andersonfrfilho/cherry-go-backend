import { Kafka, Producer } from "kafkajs";
import { inject } from "tsyringe";

import { QueueSendMessageDTO } from "@shared/container/providers/QueueProvider/dtos";
import { QueueProviderInterface } from "@shared/container/providers/QueueProvider/QueueProvider.interface";

class KafkaQueueProvider implements QueueProviderInterface {
  private producer: Producer;

  constructor(@inject("KafkaClient") private client: Kafka) {
    this.producer = this.client.producer();
  }

  async sendMessage({
    topic,
    messages,
  }: QueueSendMessageDTO): Promise<boolean> {
    try {
      await this.producer.connect();
      await this.producer.send({
        topic,
        messages,
      });
      await this.producer.disconnect();
      return true;
    } catch (err) {
      console.log(err);
      return false;
    }
  }
}
export { KafkaQueueProvider };
