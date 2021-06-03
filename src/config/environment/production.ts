import { interface_config } from "@config/environment/config.interface";
import { TopicsQueueEnum } from "@shared/container/providers/QueueProvider/topics/sendEmail.topics";

export const production: interface_config = {
  application: {
    name: "Cherry-go",
  },
  mail: {
    active: Boolean(process.env.MAIL_COMMUNICATION) || false,
    token: {
      expiration_time:
        Number(process.env.TOKEN_EXPIRATION_TIME_MAIL_CONFIRMATION) || 30,
    },
    queue: {
      topic: TopicsQueueEnum.SEND_MAIL || "",
    },
  },
  sms: {
    active: Boolean(process.env.SMS_COMMUNICATION) || false,
    provider: process.env.SMS_PROVIDER || "vonage",
    api_key: process.env.SMS_API_KEY || "",
    api_secret: process.env.SMS_API_SECRET || "",
    queue: {
      topic: TopicsQueueEnum.SEND_SMS || "",
    },
  },
  queue: {
    broker: {
      base_url:
        process.env.QUEUE_BASE_URL_BROKER || "host.docker.internal:9094",
    },
  },
};
