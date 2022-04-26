const rootDir = process.env.ENVIRONMENT === 'development'?'./src':'./dist';
const extension = process.env.ENVIRONMENT === 'development'?'ts':'js';
console.log(rootDir)
console.log(extension)
console.log([`${rootDir}/modules/**/infra/typeorm/entities/*.${extension}`])
module.exports = [
  {
    name: "default",
    type: "postgres",
    port: Number(process.env.POSTGRES_PORT) || 5432,
    host: process.env.POSTGRES_HOST || "localhost",
    username: process.env.POSTGRES_USER || "postgres",
    password: process.env.POSTGRES_PASSWORD || "cherry_go_pwd",
    database: process.env.POSTGRES_DB || "cherry_go",
    migrations: [`${rootDir}/shared/infra/typeorm/migrations/*.${extension}`],
    entities: [`${rootDir}/modules/**/infra/typeorm/entities/*.${extension}`],
    cli: {
      migrationsDir: `${rootDir}/shared/infra/typeorm/migrations`,
    },
  },
  {
    name: "seed",
    type: "postgres",
    port: Number(process.env.POSTGRES_PORT) || 5432,
    host: process.env.POSTGRES_HOST || "localhost",
    username: process.env.POSTGRES_USER || "postgres",
    password: process.env.POSTGRES_PASSWORD || "cherry_go_pwd",
    database: process.env.POSTGRES_DB || "cherry_go",
    migrations: [`${rootDir}/shared/infra/typeorm/seed/*.${extension}`],
    entities: [`${rootDir}/modules/**/infra/typeorm/entities/*.${extension}`],
    cli: {
      migrationsDir: `${rootDir}/shared/infra/typeorm/seed`,
    },
  },
  {
    name: "seeds",
    type: "postgres",
    port: Number(process.env.POSTGRES_PORT) || 5432,
    host: process.env.POSTGRES_HOST || "localhost",
    username: process.env.POSTGRES_USER || "postgres",
    password: process.env.POSTGRES_PASSWORD || "cherry_go_pwd",
    database: process.env.POSTGRES_DB || "cherry_go",
    migrations: [`${rootDir}/shared/infra/typeorm/seeds/*.${extension}`],
    entities: [`${rootDir}/modules/**/infra/typeorm/entities/*.${extension}`],
    cli: {
      migrationsDir: `${rootDir}/shared/infra/typeorm/seeds`,
    },
  },
  {
    name: "mongo",
    type: "mongodb",
    host: process.env.MONGO_HOST || "localhost",
    port: Number(process.env.MONGO_PORT) || 27017,
    database: process.env.MONGO_DATABASE || "cherry_go",
    useUnifiedTopology: true,
    entities: [`${rootDir}/modules/**/infra/typeorm/schemas/*.${extension}`],
  },
];


