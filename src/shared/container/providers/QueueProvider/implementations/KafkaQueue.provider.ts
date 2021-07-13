import { Kafka } from "kafkajs";

import { QueueSendMessageDTO } from "@shared/container/providers/QueueProvider/dtos";
import { QueueProviderInterface } from "@shared/container/providers/QueueProvider/Queue.provider.interface";

class KafkaQueueProvider implements QueueProviderInterface {
  private client: Kafka;
  constructor() {
    this.client = new Kafka({
      clientId: "api-cherry-go",
      brokers: ["host.docker.internal:9094"],
    });
  }

  async sendMessage({
    topic,
    messages,
  }: QueueSendMessageDTO): Promise<boolean> {
    const producer = this.client.producer();
    try {
      if (
        process.env.ENVIRONMENT === "test" ||
        !!process.env.MAIL_COMMUNICATION
      ) {
        return true;
      }
      await producer.connect();
      await producer.send({
        topic,
        messages,
      });
      await producer.disconnect();
      return true;
    } catch (err) {
      console.log(err);
      return false;
    }
  }
}
export { KafkaQueueProvider };
