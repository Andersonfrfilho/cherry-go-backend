import { development } from "@config/environment/development";
import { production } from "@config/environment/production";
import { staging } from "@config/environment/staging";
import { test } from "@config/environment/test";

const configs: {
  development: typeof development;
  production: typeof production;
  staging: typeof staging;
  test: typeof test;
} = {
  development,
  production,
  staging,
  test,
};

const config:
  | typeof development
  | typeof production
  | typeof staging
  | typeof test = configs[process.env.ENVIRONMENT];

export { config };
