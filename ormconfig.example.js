const path = require('path');

const rootDir = process.env.ENVIRONMENT === 'development'?'./src':'./dist';
const extension = process.env.ENVIRONMENT === 'development'?'ts':'js';

const configTypeorm = []

const migrationsPath = path.resolve(rootDir, 'shared','infra','typeorm','migrations',`*.${extension}`);
const entitiesPath = path.resolve(rootDir, 'modules','**','entities',`*.${extension}`);
const migrationsDir = path.resolve(rootDir, 'shared','infra','typeorm',`migrations`);

const connectionDefault = {
  name: "default",
  type: "postgres",
  port: Number(process.env.POSTGRES_PORT) || 5432,
  host: process.env.POSTGRES_HOST || "localhost",
  username: process.env.POSTGRES_USER || "postgres",
  password: process.env.POSTGRES_PASSWORD || "cherry_go_pwd",
  database: process.env.POSTGRES_DB || "cherry_go",
  migrations: [migrationsPath],
  entities: [entitiesPath],
  cli: {
    migrationsDir: migrationsDir,
  },
};

configTypeorm.push(connectionDefault)

const migrationsSeedPath = path.resolve(rootDir, 'shared','infra','typeorm','seed',`*.${extension}`);
const entitiesSeedPath = path.resolve(rootDir, 'modules','**','entities',`*.${extension}`);
const migrationsSeedDir = path.resolve(rootDir, 'shared','infra','typeorm',`seed`);

const connectionSeed =   {
  name: "seed",
  type: "postgres",
  port: Number(process.env.POSTGRES_PORT) || 5432,
  host: process.env.POSTGRES_HOST || "localhost",
  username: process.env.POSTGRES_USER || "postgres",
  password: process.env.POSTGRES_PASSWORD || "cherry_go_pwd",
  database: process.env.POSTGRES_DB || "cherry_go",
  migrations: [migrationsSeedPath],
  entities: [entitiesSeedPath],
  cli: {
    migrationsDir: migrationsSeedDir,
  },
}

configTypeorm.push(connectionSeed)

const migrationsSeedsPath = path.resolve(rootDir, 'shared','infra','typeorm','seeds',`*.${extension}`);
const entitiesSeedsPath = path.resolve(rootDir, 'modules','**','entities',`*.${extension}`);
const migrationsSeedsDir = path.resolve(rootDir, 'shared','infra','typeorm',`seeds`);

const connectionSeeds =   {
  name: "seeds",
  type: "postgres",
  port: Number(process.env.POSTGRES_PORT) || 5432,
  host: process.env.POSTGRES_HOST || "localhost",
  username: process.env.POSTGRES_USER || "postgres",
  password: process.env.POSTGRES_PASSWORD || "cherry_go_pwd",
  database: process.env.POSTGRES_DB || "cherry_go",
  migrations: [migrationsSeedsPath],
  entities: [entitiesSeedsPath],
  cli: {
    migrationsDir: migrationsSeedsDir,
  },
}

configTypeorm.push(connectionSeeds)

const entitiesMongoPath = path.resolve(rootDir, 'modules','**','infra','typeorm','schemas',`*.${extension}`);

const connectionMongo =     {
  name: "mongo",
  type: "mongodb",
  host: process.env.MONGO_HOST || "localhost",
  port: Number(process.env.MONGO_PORT) || 27017,
  database: process.env.MONGO_DATABASE || "cherry_go",
  useUnifiedTopology: true,
  entities: [entitiesMongoPath],
}

configTypeorm.push(connectionMongo)

module.exports = configTypeorm;
