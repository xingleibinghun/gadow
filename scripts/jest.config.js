const tsJestOpts = {
  tsconfig: '<rootDir>/tsconfig.test.json'
}

module.exports = {
  rootDir: process.cwd(),
  collectCoverage: true,
  transform: {
    '^.+\\.ts$': ['ts-jest', tsJestOpts],
    '^.+\\.tsx$': ['ts-jest', tsJestOpts]
  },
  coverageDirectory: '<rootDir>/coverage',
  moduleFileExtensions: ['js', 'ts', 'tsx'],
  testMatch: ['<rootDir>/**/*.test.ts', '<rootDir>/**/*.test.tsx'],
  globals: {
    __DEBUG_BUILD__: true
  },
  testPathIgnorePatterns: ['<rootDir>/dist/', '<rootDir>/node_modules/']
}
