const { pathsToModuleNameMapper } = require('ts-jest');
const { compilerOptions } = require('./tsconfig.test.json');

/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  // [...]
  transform: {
    // '^.+\\.[tj]sx?$' to process js/ts with `ts-jest`
    // '^.+\\.m?[tj]sx?$' to process js/ts/mjs/mts with `ts-jest`
    '^.+\\.ts?$': [
      'ts-jest',
      {
        // ts-jest configuration goes here
      },
    ],
  },
  roots: ['.'],
  modulePaths: [ compilerOptions.baseUrl ],
  testMatch: [ './__tests__/**/*.ts', './**/?(*.)+(spec|test).ts'],
}
