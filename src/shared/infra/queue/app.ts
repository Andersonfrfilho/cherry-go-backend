import "dotenv/config";
import "reflect-metadata";
import { Kafka } from "kafkajs";

import { config } from "@config/environment";
import { EtherealMailProvider } from "@shared/container/providers/MailProvider/implementations/EtherealMail.provider";
import { VonageSmsProvider } from "@shared/container/providers/SmsProvider/implementations/VonageSms.provider";

const kafka = new Kafka({
  clientId: "api-cherry-go",
  brokers: [config.queue.broker.base_url],
});

const consumer_send_email = kafka.consumer({
  groupId: `send-email-consumer${Math.random()}`,
});

const consumer_send_sms = kafka.consumer({
  groupId: `send-sms-consumer${Math.random()}`,
});

const emailProvider = new EtherealMailProvider();
const smsProvider = new VonageSmsProvider();

async function run() {
  await consumer_send_email.connect();
  await consumer_send_email.subscribe({ topic: config.mail.queue.topic });
  await consumer_send_email.run({
    eachMessage: async ({ topic, partition, message }) => {
      const prefix = `${topic}[${partition} | ${message.offset}] / ${message.timestamp}`;
      console.log(` - ${prefix} ${message.key}#${message.value}`);
      const { to, email_type, variables } = JSON.parse(String(message.value));
      if (config.mail.active) {
        await emailProvider.sendMail({
          email_type,
          to,
          variables,
        });
      }
    },
  });

  await consumer_send_sms.connect();
  await consumer_send_sms.subscribe({ topic: config.sms.queue.topic });
  await consumer_send_sms.run({
    eachMessage: async ({ topic, partition, message }) => {
      const prefix = `${topic}[${partition} | ${message.offset}] / ${message.timestamp}`;
      console.log(` - ${prefix} ${message.key}#${message.value}`);
      const { to, from, text } = JSON.parse(String(message.value));
      if (config.sms.active) {
        await smsProvider.sendSms({ from, text, to });
      }
    },
  });
}

run().catch(console.error);
