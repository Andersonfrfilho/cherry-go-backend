interface message {
  value: string;
}

export interface QueueSendMessageDTO {
  topic: string;
  messages: message[];
}
