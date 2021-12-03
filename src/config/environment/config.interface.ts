import { Address } from "@modules/addresses/infra/typeorm/entities/Address";
import { Bank } from "@shared/container/providers/BankProvider/dtos/GetAll.dto";

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
  token: expiration_token;
}

interface mail {
  active: boolean;
  token: expiration_token;
  queue: topic;
}
interface broker {
  base_url: string;
}
interface stripe {
  public_key: string;
  secret_key: string;
}
interface payment {
  provider: "local" | "stripe";
  stripe: stripe;
}
interface queue {
  broker: broker;
}
interface appointment {
  hour_allowed_cancellation: number;
}
interface providers {
  max_images_quantity: number;
}
interface app {
  name: string;
  minimum_age_required: number;
}
interface password {
  time_token_expires: number;
}
interface storage {
  base_url: string;
}
interface bank {
  provider: "local" | "brasilApi";
}

interface geolocation {
  provider: "local" | "google";
  api_key: string;
}
interface cache {
  invalidade: {
    // in milisseconds
    time: number;
  };
}
interface address {
  provider: "local" | "brasilApi";
  cache: cache;
}
export interface interface_config {
  application: app;
  mail: mail;
  sms: sms;
  queue: queue;
  password: password;
  storage: storage;
  appointment: appointment;
  providers: providers;
  payment: payment;
  bank: bank;
  geolocation: geolocation;
  address: address;
}

export interface InterfaceConfig {
  development: interface_config;
  staging: interface_config;
  production: interface_config;
  test: interface_config;
}
