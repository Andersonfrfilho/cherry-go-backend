import { TOPICS_QUEUE_ENUM } from "@shared/container/providers/QueueProvider/topics/sendEmail.topics";

import { version, name } from "../../../package.json";
import {
  ADDRESS_PROVIDER_ENUM,
  BANK_PROVIDER_ENUM,
  GEOLOCATION_PROVIDER_ENUM,
  PAYMENT_PROVIDER_ENUM,
} from "./config.enum";

export const staging = {
  application: {
    name,
    version,
    minimum_age_required:
      Number(process.env.MINIMUM_AGE_REQUIRED || 18) >= 18
        ? Number(process.env.MINIMUM_AGE_REQUIRED || 18)
        : 18,
    port: Number(process.env.PORT || 3333),
  },
  auth: {
    secret: {
      token: process.env.HASH_TOKEN || "89ba023086e37a345839e0c6a0d272eb",
      refresh:
        process.env.HASH_REFRESH_TOKEN || "a7e071b3de48cec1dd24de6cbe6c7bf1",
    },
    expires_in: {
      token: process.env.EXPIRE_IN_TOKEN || "7d",
      refresh: process.env.EXPIRE_IN_REFRESH_TOKEN || "30d",
      refresh_days: Number(process.env.DAYS_REFRESH_TOKEN || 30),
    },
  },
  providers: {
    max_images_quantity: Number(process.env.PROVIDERS_MAX_IMAGE_QUANTITY || 5),
    ratings: {
      number_max: Number(process.env.PROVIDERS_RATINGS_NUMBER_MAX || 5),
    },
    post_appointment_time: Number(
      process.env.PROVIDER_POST_APPOINTMENT_TIME || 1
    ),
  },
  bank: {
    provider: BANK_PROVIDER_ENUM[process.env.BANK_PROVIDER || "local"],
  },
  password: {
    time_token_expires: Number(process.env.PASSWORD_TIME_TOKEN_EXPIRED || 30),
  },
  storage: {
    provider: process.env.STORAGE_PROVIDER || "local",
    base_url: process.env.STORAGE_URL || `http://localhost:${process.env.PORT}`,
    api_key: process.env.AWS_BUCKET_ACCESS_KEY_ID || "",
    api_secret: process.env.AWS_BUCKET_SECRET_ACCESS_KEY || "",
    bucket_name: process.env.AWS_BUCKET_NAME || "",
    bucket_region: process.env.AWS_BUCKET_REGION || "",
  },
  appointment: {
    hour_allowed_cancellation: Number(
      process.env.HOUR_ALLOWED_CANCELLATION || 1
    ),
    period_for_selected: Number(process.env.PERIOD_FOR_SELECTED || 15),
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
    api_key: process.env.AWS_SMTP_ACCESS_KEY_ID || "",
    api_secret: process.env.AWS_SMTP_SECRET_ACCESS_KEY || "",
    token: {
      expiration_time:
        Number(process.env.TOKEN_EXPIRATION_TIME_MAIL_CONFIRMATION) || 30,
    },
    queue: {
      topic: TOPICS_QUEUE_ENUM.SEND_MAIL || "",
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
    provider: process.env.SMS_PROVIDER || "sns",
    api_key: process.env.AWS_SNS_ACCESS_KEY_ID || "",
    api_secret: process.env.AWS_SNS_SECRET_ACCESS_KEY || "",
    queue: {
      topic: TOPICS_QUEUE_ENUM.SEND_SMS || "send-sms",
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
