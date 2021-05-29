import {
  InterfaceConfig,
  interface_config,
} from "@config/environment/config.interface";
import { development } from "@config/environment/development";
import { production } from "@config/environment/production";
import { staging } from "@config/environment/staging";

const configs: InterfaceConfig = {
  development,
  production,
  staging,
};

const config: interface_config = configs[process.env.ENVIRONMENT];

export { config };
