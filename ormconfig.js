module.exports = [
  {
    name: "default",
    type: "postgres",
    port: process.env.POSTGRES_PORT || 5432,
    host: process.env.POSTGRES_HOST || "localhost",
    username: process.env.POSTGRES_USER || "docker",
    password: process.env.POSTGRES_PASSWORD || "102030",
    database: process.env.POSTGRES_DB || "cherry_go",
    migrations: [
      "./src/shared/infra/typeorm/migrations/*.ts"
    ],
    entities: [
      "./src/modules/**/entities/*.ts"
    ],
    cli: {
      "migrationsDir": "./src/shared/infra/typeorm/migrations"
    }
  },
  {
    name: "seed",
    type: "postgres",
    port: process.env.POSTGRES_PORT || 5432,
    host: process.env.POSTGRES_HOST || "localhost",
    username: process.env.POSTGRES_USER || "docker",
    password: process.env.POSTGRES_PASSWORD || "102030",
    database: process.env.POSTGRES_DB || "cherry_go",
    migrations: [
      "./src/shared/infra/typeorm/seeds/*.ts"
    ],
    entities: [
      "./src/modules/**/entities/*.ts"
    ],
    cli: {
      "migrationsDir": "./src/shared/infra/typeorm/seeds"
    }
  },
  {
    name: "mongo",
    type: "mongodb",
    host: process.env.MONGO_HOST || "localhost",
    port: process.env.MONGO_PORT || 27017,
    database: process.env.MONGO_DATABASE || "cherry_go",
    useUnifiedTopology: true,
    entities: [
      "./src/modules/**/infra/typeorm/schemas/*.ts"
    ]
  }
]
