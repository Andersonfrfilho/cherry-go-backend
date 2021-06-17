import { container } from "tsyringe";

import { EtherealMailProvider } from "@shared/container/providers/MailProvider/implementations/EtherealMailProvider";
import { SESMailProvider } from "@shared/container/providers/MailProvider/implementations/SESMailProvider";
import { MailProviderInterface } from "@shared/container/providers/MailProvider/MailProvider.interface";

const mailProvider = {
  ethereal: container.resolve(EtherealMailProvider),
  ses: container.resolve(SESMailProvider),
};

container.registerInstance<MailProviderInterface>(
  "MailProvider",
  mailProvider[`${process.env.MAIL_PROVIDER}`]
);
