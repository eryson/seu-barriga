// For a detailed explanation regarding each configuration property, visit:
// https://jestjs.io/docs/en/configuration.html

module.exports = {
  // All imported modules in your tests should be mocked automatically
  // automock: false,

  // Stop running tests after `n` failures
  //   bail: true,

  // Automatically clear mock calls and instances between every test
  // clearMocks: true,

  // Indicates whether the coverage information should be collected while executing the test
  collectCoverage: false,

  // An array of glob patterns indicating a set of files for which coverage information should be collected
  collectCoverageFrom: ["src/**"],

  // The directory where Jest should output its coverage files
  coverageDirectory: "__test__/coverage",

  // An array of regexp pattern strings used to skip coverage collection
  coveragePathIgnorePatterns: [
    "__test__",
    "src/database/migrations",
    "src/database/seeders",
    "src/database/index",
  ],

  // The test environment that will be used for testing
  testEnvironment: "node",

  // The glob patterns Jest uses to detect test files
  testMatch: ["**/__test__/**/*.test.js?(x)"],

  // transform: {
  //   ".(js|jsx|ts|tsx)": "@sucrase/jest-plugin",
  // },

  setupFilesAfterEnv: ["./jest.setup.js"],
};
