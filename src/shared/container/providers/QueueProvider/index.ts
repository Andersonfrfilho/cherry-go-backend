import { container } from "tsyringe";

import { KafkaQueueProvider } from "@shared/container/providers/QueueProvider/implementations/KafkaQueue.provider";
import { LocalQueueProvider } from "@shared/container/providers/QueueProvider/implementations/LocalQueue.provider";
import { QueueProviderInterface } from "@shared/container/providers/QueueProvider/Queue.provider.interface";

const queue = {
  test: LocalQueueProvider,
  kafka: KafkaQueueProvider,
};

container.registerSingleton<QueueProviderInterface>(
  "QueueProvider",
  queue[process.env.QUEUE_PROVIDER]
);
