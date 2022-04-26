import { container } from "tsyringe";

import { EtherealMailProvider } from "@shared/container/providers/MailProvider/implementations/EtherealMail.provider";
import { SESMailProvider } from "@shared/container/providers/MailProvider/implementations/SESMail.provider";
import { MailProviderInterface } from "@shared/container/providers/MailProvider/Mail.provider.interface";

const mailProvider = {
  ethereal: container.resolve(EtherealMailProvider),
  ses: container.resolve(SESMailProvider),
};

container.registerInstance<MailProviderInterface>(
  "MailProvider",
  container.resolve(EtherealMailProvider)
);
