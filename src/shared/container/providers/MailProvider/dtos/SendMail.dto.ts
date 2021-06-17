import { MailContent } from "@shared/container/providers/MailProvider/enums/MailType.enum";

export interface SendMailDTO {
  to: string;
  variables: any;
  email_type: MailContent;
}
