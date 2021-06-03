import { ConnectionOptions } from "typeorm";

export default [
  {
    name: "default",
    type: "postgres",
    port: Number(process.env.POSTGRES_PORT_TEST) || 5434,
    host: process.env.POSTGRES_HOST || "localhost",
    username: process.env.POSTGRES_USER || "postgres",
    password: process.env.POSTGRES_PASSWORD || "102030",
    database: process.env.POSTGRES_DB_TEST || "cherry_go_test",
    dropSchema: true,
    logging: false,
    migrationsRun: true,
    migrations: ["./src/shared/infra/typeorm/migrations/*.ts"],
    entities: ["./src/modules/**/entities/*.ts"],
    cli: {
      migrationsDir: "./src/shared/infra/typeorm/migrations",
    },
  },
  {
    name: "seed",
    type: "postgres",
    port: Number(process.env.POSTGRES_PORT_TEST) || 5434,
    host: process.env.POSTGRES_HOST || "localhost",
    username: process.env.POSTGRES_USER || "postgres",
    password: process.env.POSTGRES_PASSWORD || "102030",
    database: process.env.POSTGRES_DB_TEST || "cherry_go_test",
    migrations: ["./src/shared/infra/typeorm/seed/*.ts"],
    entities: ["./src/modules/**/entities/*.ts"],
    cli: {
      migrationsDir: "./src/shared/infra/typeorm/seed",
    },
  },
  {
    name: "mongo",
    type: "mongodb",
    host: process.env.MONGO_HOST || "localhost",
    port: Number(process.env.MONGO_PORT) || 27017,
    database: process.env.MONGO_DATABASE || "cherry_go_test",
    useUnifiedTopology: true,
    entities: ["./src/modules/**/infra/typeorm/schemas/*.ts"],
  },
] as ConnectionOptions[];
