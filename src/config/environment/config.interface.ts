interface expiration_token {
  expiration_time: number;
}

interface mail {
  token: expiration_token;
}
export interface interface_config {
  mail: mail;
}
export interface InterfaceConfig {
  development: interface_config;
  staging: interface_config;
  production: interface_config;
}
