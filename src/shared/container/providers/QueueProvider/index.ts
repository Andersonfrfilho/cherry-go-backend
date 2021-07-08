import { container } from "tsyringe";

import { KafkaQueueProvider } from "@shared/container/providers/QueueProvider/implementations/KafkaQueueProvider";
import { QueueProviderInterface } from "@shared/container/providers/QueueProvider/Queue.provider.interface";

container.registerSingleton<QueueProviderInterface>(
  "QueueProvider",
  KafkaQueueProvider
);
