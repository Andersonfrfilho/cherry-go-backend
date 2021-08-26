import { ValueTransformer } from "typeorm";

export const lowercase: ValueTransformer = {
  to: (entityValue: string) => {
    return entityValue && entityValue.toLowerCase();
  },
  from: (databaseValue: string) => {
    return databaseValue;
  },
};
