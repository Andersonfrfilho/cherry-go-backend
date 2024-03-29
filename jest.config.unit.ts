import { pathsToModuleNameMapper } from "ts-jest/utils";

import { compilerOptions } from "./tsconfig.json";

export default {
  // All imported modules in your tests should be mocked automatically
  // automock: false,

  // Stop running tests after `n` failures
  bail: false,

  // The directory where Jest should store its cached dependency information
  // cacheDirectory: "C:\\Users\\ander\\AppData\\Local\\Temp\\jest",

  // Automatically clear mock calls and instances between every test
  clearMocks: true,
  resetMocks: true,
  // Indicates whether the coverage information should be collected while executing the test
  collectCoverage: true,

  // An array of glob patterns indicating a set of files for which coverage information should be collected
  collectCoverageFrom: [
    "<rootDir>/src/modules/**/useCases/**/*service.ts",
    "<rootDir>/src/shared/infra/typeorm/factories/*.factory.ts",
    // "<rootDir>/src/**/*.ts",
    // "!<rootDir>/src/config/**/**.ts",
    // "!<rootDir>/src/@types/**/**.ts",
    // "!<rootDir>/src/modules/**/infra/typeorm/entities/**.ts",
    // "!<rootDir>/src/modules/**/constants/**.ts",
    // "!<rootDir>/src/modules/**/dtos/**.ts",
    // "!<rootDir>/src/modules/**/enums/**.ts",
    // "!<rootDir>/src/modules/**/repositories/mocks/**.ts",
    // "!<rootDir>/src/shared/enums/**.ts",
    // "!<rootDir>/src/shared/http/enums/**.ts",
    // "!<rootDir>/src/shared/errors/constants/**.ts",
    // "!<rootDir>/src/shared/errors/dtos/**.ts",
    // "!<rootDir>/src/shared/errors/enums/**.ts",
    // "!<rootDir>/src/shared/infra/http/routes/**.ts",
    // "!<rootDir>/src/shared/infra/http/enums/**.ts",
    // "!<rootDir>/src/shared/infra/http/**.ts",
    // "!<rootDir>/src/shared/infra/http/routes/**/**.ts",
    // "!<rootDir>/src/shared/docs/**.ts",
    // "!<rootDir>/src/shared/container/providers/**/enums/**.ts",
    // "!<rootDir>/src/shared/container/providers/**/dtos/**.ts",
    // "!<rootDir>/src/shared/container/providers/**/mocks/**.ts",
    // "!<rootDir>/src/shared/infra/typeorm/migrations/*.ts",
    // "!<rootDir>/src/shared/infra/typeorm/seed/*.ts",
    // "!<rootDir>/src/shared/infra/typeorm/seeds/*.ts",
    // "!<rootDir>/src/shared/infra/typeorm/*.ts",
    // "!<rootDir>/src/shared/errors/*.ts",
    // "!<rootDir>/src/shared/container/**/**/*.ts",
    // "<rootDir>/src/shared/container/providers/**/implementations/*.ts",
  ],

  // The directory where Jest should output its coverage files
  coverageDirectory: "covarage_unit",

  // An array of regexp pattern strings used to skip coverage collection
  coveragePathIgnorePatterns: ["\\\\node_modules\\\\", "\\\\dist\\\\"],

  // Indicates which provider should be used to instrument code for coverage
  // coverageProvider: "v8",

  // A list of reporter names that Jest uses when writing coverage reports
  coverageReporters: ["text-summary", "lcov"],

  // An object that configures minimum threshold enforcement for coverage results
  // coverageThreshold: undefined,

  // A path to a custom dependency extractor
  // dependencyExtractor: undefined,

  // Make calling deprecated APIs throw helpful error messages
  // errorOnDeprecated: false,

  // Force coverage collection from ignored files using an array of glob patterns
  // forceCoverageMatch: [],
  // A path to a module which exports an async function that is triggered once before all test suites
  // globalSetup: undefined,

  // A path to a module which exports an async function that is triggered once after all test suites
  // globalTeardown: undefined,

  // A set of global variables that need to be available in all test environments
  // globals: {},

  // The maximum amount of workers used to run your tests. Can be specified as % or a number. E.g. maxWorkers: 10% will use 10% of your CPU amount + 1 as the maximum worker number. maxWorkers: 2 will use a maximum of 2 workers.
  // maxWorkers: "50%",

  // An array of directory names to be searched recursively up from the requiring module's location
  // moduleDirectories: [
  //   "node_modules"
  // ],

  // An array of file extensions your modules use
  // moduleFileExtensions: [
  //   "js",
  //   "json",
  //   "jsx",
  //   "ts",
  //   "tsx",
  //   "node"
  // ],

  // A map from regular expressions to module names or to arrays of module names that allow to stub out resources with a single module
  moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, {
    prefix: "<rootDir>/src/",
  }),

  // An array of regexp pattern strings, matched against all module paths before considered 'visible' to the module loader
  // modulePathIgnorePatterns: [],

  // Activates notifications for test results
  // notify: false,

  // An enum that specifies notification mode. Requires { notify: true }
  // notifyMode: "failure-change",

  // A preset that is used as a base for Jest's configuration
  preset: "ts-jest",

  // Run tests from one or more projects
  // projects: undefined,

  // Use this configuration option to add custom reporters to Jest
  // reporters: undefined,

  // Automatically reset mock state between every test
  // resetMocks: false,

  // Reset the module registry before running each individual test
  // resetModules: false,

  // A path to a custom resolver
  // resolver: undefined,

  // Automatically restore mock state between every test
  // restoreMocks: false,

  // The root directory that Jest should scan for tests and modules within
  // rootDir: undefined,

  // A list of paths to directories that Jest should use to search for files in
  // roots: [
  //   "<rootDir>"
  // ],

  // Allows you to use a custom runner instead of Jest's default test runner
  // runner: "jest-runner",

  // The paths to modules that run some code to configure or set up the testing environment before each test
  // setupFiles: [],

  // A list of paths to modules that run some code to configure or set up the testing framework before each test
  // setupFilesAfterEnv: [],

  // The number of seconds after which a test is considered as slow and reported as such in the results.
  // slowTestThreshold: 5,

  // A list of paths to snapshot serializer modules Jest should use for snapshot testing
  // snapshotSerializers: [],

  // The test environment that will be used for testing
  testEnvironment: "node",

  // Options that will be passed to the testEnvironment
  // testEnvironmentOptions: {},

  // Adds a location field to test results
  // testLocationInResults: false,

  // The glob patterns Jest uses to detect test files
  testMatch: ["**/*.unit.spec.ts"],
  modulePathIgnorePatterns: ["dist", "node_modules", "covarage_unit"],
};
