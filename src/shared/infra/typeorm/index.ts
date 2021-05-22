import { Connection, createConnections } from "typeorm";

import { EnvironmentTypes } from "@shared/infra/http/enums/constants";

import { typeormConfigTest } from "./config/test";

export default async (environment: string): Promise<Connection[]> => {
  if (environment === EnvironmentTypes.TEST) {
    return createConnections(typeormConfigTest);
  }
  return createConnections();
};
