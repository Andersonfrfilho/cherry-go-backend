import { MailContent } from "@shared/container/providers/MailProvider/enums/MailType.enum";

export interface ISendMailDTO {
  to: string;
  variables: any;
  email_type: MailContent;
}
