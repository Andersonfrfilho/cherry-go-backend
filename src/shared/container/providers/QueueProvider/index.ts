import { Kafka } from "aws-sdk";
import { container } from "tsyringe";

import { KafkaQueueProvider } from "@shared/container/providers/QueueProvider/implementations/KafkaQueueProvider";
import { QueueProviderInterface } from "@shared/container/providers/QueueProvider/QueueProvider.interface";

import { KafkaQueueConnectionProvider } from "./implementations/KafkaQueueConnectionProvider";

container.register("KafkaClient", {
  useFactory: async () => {
    const provider = new KafkaQueueConnectionProvider();
    await provider.connect();
    return provider.getClient();
  },
});

container.register<QueueProviderInterface>("QueueProvider", {
  useFactory: new KafkaQueueProvider().sendMessage(),
});
