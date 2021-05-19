import { Connection, createConnections } from "typeorm";

export default async (host = "localhost"): Promise<Connection[]> => {
  return createConnections();
};
