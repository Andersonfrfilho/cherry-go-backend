import { Kafka } from "kafkajs";

class KafkaQueueConnectionProvider {
  private client: Kafka;

  async connect() {
    this.client = new Kafka({
      clientId: "api-cherry-go",
      brokers: ["host.docker.internal:9094"],
    });

    await this.client.producer().connect();
  }
  getClient() {
    return this.client;
  }
}
export { KafkaQueueConnectionProvider };
