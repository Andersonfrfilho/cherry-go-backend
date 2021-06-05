import {
  InterfaceConfig,
  interface_config,
} from "@config/environment/config.interface";
import { development } from "@config/environment/development";
import { production } from "@config/environment/production";
import { staging } from "@config/environment/staging";
import { test } from "@config/environment/test";

const configs: InterfaceConfig = {
  development,
  production,
  staging,
  test,
};

const config: interface_config = configs[process.env.ENVIRONMENT];

export { config };
