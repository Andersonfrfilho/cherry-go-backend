import { TopicsQueueEnum } from "@shared/container/providers/QueueProvider/topics/sendEmail.topics";

import {
  ADDRESS_PROVIDER_ENUM,
  BANK_PROVIDER_ENUM,
  GEOLOCATION_PROVIDER_ENUM,
  PAYMENT_PROVIDER_ENUM,
} from "./config.enum";

export const production = {
  application: {
    name: "Cherry-go",
    minimum_age_required:
      Number(process.env.MINIMUM_AGE_REQUIRED || 18) >= 18
        ? Number(process.env.MINIMUM_AGE_REQUIRED || 18)
        : 18,
  },
  providers: {
    max_images_quantity: Number(process.env.PROVIDERS_MAX_IMAGE_QUANTITY || 5),
    ratings: {
      number_max: Number(process.env.PROVIDERS_RATINGS_NUMBER_MAX || 5),
    },
  },
  bank: {
    provider: BANK_PROVIDER_ENUM[process.env.BANK_PROVIDER || "local"],
  },
  password: {
    time_token_expires: Number(process.env.PASSWORD_TIME_TOKEN_EXPIRED || 30),
  },
  storage: {
    base_url:
      process.env.STORAGE_URL || `http://localhost:${process.env.PORT || 3333}`,
  },
  appointment: {
    hour_allowed_cancellation: Number(
      process.env.HOUR_ALLOWED_CANCELLATION || 1
    ),
  },
  payment: {
    provider: PAYMENT_PROVIDER_ENUM[process.env.PAYMENT_PROVIDER] || "local",
    stripe: {
      public_key: process.env.STRIPE_PUBLIC_KEY,
      secret_key: process.env.STRIPE_SECRET_KEY,
    },
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
  address: {
    provider: ADDRESS_PROVIDER_ENUM[process.env.ADDRESS_PROVIDER || "local"],
    cache: {
      invalidade: {
        time: Number(
          process.env.ADDRESS_CACHE_INVALIDATE_TIME || 1000 * 60 * 60 * 24 * 30
        ),
      },
    },
  },
  client: {
    cache: {
      invalidade: {
        time: Number(
          process.env.ADDRESS_CACHE_INVALIDATE_TIME || 1000 * 60 * 60 * 24 * 30
        ),
      },
    },
  },
  geolocation: {
    cache: {
      invalidade: {
        time: Number(
          process.env.ADDRESS_CACHE_INVALIDATE_TIME || 1000 * 60 * 60 * 3
        ),
      },
    },
    provider:
      GEOLOCATION_PROVIDER_ENUM[process.env.GEOLOCATION_PROVIDER || "local"],
    api_key: process.env.GOOGLE_MAPS_API_KEY || "",
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
