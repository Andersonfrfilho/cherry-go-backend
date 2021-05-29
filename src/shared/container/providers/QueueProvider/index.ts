import { container } from "tsyringe";

import { KafkaQueueProvider } from "@shared/container/providers/QueueProvider/implementations/KafkaQueueProvider";
import { QueueProviderInterface } from "@shared/container/providers/QueueProvider/QueueProvider.interface";

container.registerSingleton<QueueProviderInterface>(
  "QueueProvider",
  KafkaQueueProvider
);
