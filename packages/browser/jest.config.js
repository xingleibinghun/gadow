const baseConfig = require('../../scripts/jest.config.js')

module.exports = {
  ...baseConfig,
  testEnvironment: 'jsdom',
  moduleNameMapper: {
    '^@gadow/core$': require.resolve('@gadow/core'),
    '^@gadow/utils$': require.resolve('@gadow/utils'),
    '^@gadow/types$': require.resolve('@gadow/types')
  }
}
