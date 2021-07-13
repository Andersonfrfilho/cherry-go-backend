import { Connection, createConnections } from "typeorm";

import ormConfigTest from "@root/ormconfig.test";
import { ENVIRONMENT_TYPES_ENUM } from "@shared/infra/http/enums/constants";

export default async (environment?: string): Promise<Connection[]> => {
  if (environment === ENVIRONMENT_TYPES_ENUM.TEST) {
    return createConnections(ormConfigTest);
  }
  return createConnections();
};
