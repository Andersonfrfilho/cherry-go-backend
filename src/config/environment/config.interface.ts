interface expiration_token {
  expiration_time: number;
}
interface topic {
  topic: string;
}
interface sms {
  active: boolean;
  provider: string;
  api_key: string;
  api_secret: string;
  queue: topic;
}

interface mail {
  active: boolean;
  token: expiration_token;
  queue: topic;
}
interface broker {
  base_url: string;
}
interface queue {
  broker: broker;
}

interface app {
  name: string;
}
interface password {
  time_token_expires: number;
}
export interface interface_config {
  application: app;
  mail: mail;
  sms: sms;
  queue: queue;
  password: password;
}
export interface InterfaceConfig {
  development: interface_config;
  staging: interface_config;
  production: interface_config;
  test: interface_config;
}
