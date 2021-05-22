import { Connection, createConnections } from "typeorm";

import ormConfigTest from "@root/ormconfig.test";
import { EnvironmentTypes } from "@shared/infra/http/enums/constants";

export default async (environment: string): Promise<Connection[]> => {
  if (environment === EnvironmentTypes.TEST) {
    return createConnections(ormConfigTest);
  }
  return createConnections();
};
