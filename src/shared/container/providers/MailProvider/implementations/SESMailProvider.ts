import { SES } from "aws-sdk";
import fs from "fs";
import handlebars from "handlebars";
import nodemailer, { Transporter } from "nodemailer";
import { resolve } from "path";

import { ISendMailDTO } from "@shared/container/providers/MailProvider/dtos/ISendMailDTO";
import {
  MailSubject,
  MailType,
} from "@shared/container/providers/MailProvider/enums/MailType.enum";
import { IMailProvider } from "@shared/container/providers/MailProvider/IMailProvider";

class SESMailProvider implements IMailProvider {
  private client: Transporter;

  constructor() {
    this.createClient();
  }

  private async createClient() {
    try {
      this.client = nodemailer.createTransport({
        SES: new SES({
          apiVersion: "2010-12-01",
          region: process.env.AWS_DEFAULT_REGION,
        }),
      });
    } catch (err) {
      console.error(`EtherealMailProvider - Error:\n${err}`);
    }
  }

  async sendMail({ to, variables, email_type }: ISendMailDTO): Promise<void> {
    const templatePath = resolve(
      __dirname,
      "..",
      "..",
      "MailProvider",
      "views",
      "emails",
      `${MailType[email_type]}.hbs`
    );

    const templateFileContent = fs.readFileSync(templatePath, "utf-8");

    const templateParse = handlebars.compile(templateFileContent);

    const templateHTML = templateParse(variables);

    await this.client.sendMail({
      to,
      from: "Cherry go <noreplay@cherrygo.com.br>",
      subject: MailSubject[email_type],
      html: templateHTML,
    });
  }
}

export { SESMailProvider };
