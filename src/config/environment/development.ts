import { interface_config } from "@config/environment/config.interface";
import { TopicsQueueEnum } from "@shared/container/providers/QueueProvider/topics/sendEmail.topics";

import { BANK_PROVIDER_ENUM, PAYMENT_PROVIDER_ENUM } from "./config.enum";

export const development: interface_config = {
  application: {
    name: "Cherry-go",
    minimum_age_required:
      Number(process.env.MINIMUM_AGE_REQUIRED || 18) >= 18
        ? Number(process.env.MINIMUM_AGE_REQUIRED || 18)
        : 18,
  },
  bank: {
    provider: BANK_PROVIDER_ENUM[process.env.BANK_PROVIDER || "local"],
  },
  appointment: {
    hour_allowed_cancellation: Number(
      process.env.HOUR_ALLOWED_CANCELLATION || 1
    ),
  },
  providers: {
    max_images_quantity: Number(process.env.PROVIDERS_MAX_IMAGE_QUANTITY || 5),
  },
  payment: {
    provider: PAYMENT_PROVIDER_ENUM[process.env.PAYMENT_PROVIDER] || "local",
    stripe: {
      public_key: process.env.STRIPE_PUBLIC_KEY || "",
      secret_key: process.env.STRIPE_SECRET_KEY || "",
    },
  },
  password: {
    time_token_expires: Number(process.env.PASSWORD_TIME_TOKEN_EXPIRED || 30),
  },
  storage: {
    base_url:
      process.env.STORAGE_URL || `http://localhost:${process.env.PORT || 3333}`,
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
    token: {
      expiration_time:
        Number(process.env.TOKEN_EXPIRATION_TIME_SMS_CONFIRMATION) || 30,
    },
  },
  queue: {
    broker: {
      base_url:
        process.env.QUEUE_BASE_URL_BROKER || "host.docker.internal:9094",
    },
  },
};
