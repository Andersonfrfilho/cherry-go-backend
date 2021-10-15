const srcConfig = [
  {
    name: "default",
    type: "postgres",
    port: process.env.POSTGRES_PORT || 5432,
    host: process.env.POSTGRES_HOST || "localhost",
    username: process.env.POSTGRES_USER || "postgres",
    password: process.env.POSTGRES_PASSWORD || "password",
    database: process.env.POSTGRES_DB || "database_name",
    migrations: ["./src/shared/infra/typeorm/migrations/*.ts"],
    entities: ["./src/modules/**/entities/*.ts"],
    cli: {
      migrationsDir: "./src/shared/infra/typeorm/migrations",
    },
  },
  {
    name: "seed",
    type: "postgres",
    port: process.env.POSTGRES_PORT || 5432,
    host: process.env.POSTGRES_HOST || "localhost",
    username: process.env.POSTGRES_USER || "postgres",
    password: process.env.POSTGRES_PASSWORD || "password",
    database: process.env.POSTGRES_DB || "database_name",
    migrations: ["./src/shared/infra/typeorm/seeds/*.ts"],
    entities: ["./src/modules/**/entities/*.ts"],
    cli: {
      migrationsDir: "./src/shared/infra/typeorm/seeds",
    },
  },
  {
    name: "mongo",
    type: "mongodb",
    host: process.env.MONGO_HOST || "localhost",
    port: process.env.MONGO_PORT || 27017,
    database: process.env.MONGO_DATABASE || "database_name",
    useUnifiedTopology: true,
    entities: ["./src/modules/**/infra/typeorm/schemas/*.ts"],
  },
];

const distConfig = [
  {
    name: "default",
    type: "postgres",
    port: process.env.POSTGRES_PORT || 5432,
    host: process.env.POSTGRES_HOST || "localhost",
    username: process.env.POSTGRES_USER || "postgres",
    password: process.env.POSTGRES_PASSWORD || "password",
    database: process.env.POSTGRES_DB || "database_name",
    migrations: ["./dist/shared/infra/typeorm/migrations/*.js"],
    entities: ["./dist/modules/**/entities/*.js"],
    cli: {
      migrationsDir: "./dist/shared/infra/typeorm/migrations",
    },
  },
  {
    name: "seed",
    type: "postgres",
    port: process.env.POSTGRES_PORT || 5432,
    host: process.env.POSTGRES_HOST || "localhost",
    username: process.env.POSTGRES_USER || "postgres",
    password: process.env.POSTGRES_PASSWORD || "password",
    database: process.env.POSTGRES_DB || "database_name",
    migrations: ["./dist/shared/infra/typeorm/seeds/*.js"],
    entities: ["./dist/modules/**/entities/*.js"],
    cli: {
      migrationsDir: "./dist/shared/infra/typeorm/seeds",
    },
  },
  {
    name: "mongo",
    type: "mongodb",
    host: process.env.MONGO_HOST || "localhost",
    port: process.env.MONGO_PORT || 27017,
    database: process.env.MONGO_DATABASE || "database_name",
    useUnifiedTopology: true,
    entities: ["./dist/modules/**/infra/typeorm/schemas/*.js"],
  },
];


module.exports = process.env.TS_NODE ? srcConfig : distConfig;
