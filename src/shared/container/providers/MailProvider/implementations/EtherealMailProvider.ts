import fs from "fs";
import handlebars from "handlebars";
import nodemailer, { Transporter } from "nodemailer";
import { resolve } from "path";
import { injectable } from "tsyringe";

import { SendMailDTO } from "@shared/container/providers/MailProvider/dtos";
import {
  MailSubject,
  MailType,
} from "@shared/container/providers/MailProvider/enums/MailType.enum";
import { MailProviderInterface } from "@shared/container/providers/MailProvider/MailProvider.interface";

@injectable()
export class EtherealMailProvider implements MailProviderInterface {
  private client: Transporter;
  constructor() {
    nodemailer
      .createTestAccount()
      .then((account) => {
        // create reusable transporter object using the default SMTP transport
        const transporter = nodemailer.createTransport({
          host: account.smtp.host,
          port: account.smtp.port,
          secure: account.smtp.secure, // true for 465, false for other ports
          auth: {
            user: account.user, // generated ethereal user
            pass: account.pass, // generated ethereal password
          },
        });
        this.client = transporter;
      })
      .catch((err) => console.error(err));
  }

  async sendMail({ to, variables, email_type }: SendMailDTO): Promise<void> {
    const templatePath = resolve(
      __dirname,
      "..",
      "..",
      "MailProvider",
      "views",
      "emails",
      `${MailType[email_type]}.hbs`
    );
    const templateFileContent = fs.readFileSync(templatePath).toString("utf-8");
    const templateParse = handlebars.compile(templateFileContent);
    const templateHTML = templateParse(variables);
    const message = await this.client.sendMail({
      to,
      from: "Cherry go <noreplay@cherrygo.com.br>",
      subject: MailSubject[email_type],
      html: templateHTML,
    });

    console.log("Message sent: %s", message.messageId);
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(message));
  }
}
