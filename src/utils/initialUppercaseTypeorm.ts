import { ValueTransformer } from "typeorm";

export const initialUpperCase: ValueTransformer = {
  to: (entityValue: string) => {
    return entityValue.charAt(0).toUpperCase() + entityValue.slice(1);
  },
  from: (databaseValue: string) => {
    return databaseValue;
  },
};
