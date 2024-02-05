const baseConfig = require('../../scripts/jest.config.js')

module.exports = {
  ...baseConfig,
  testEnvironment: 'jsdom',
  moduleNameMapper: {
    '^@gadow/utils$': require.resolve('@gadow/utils'),
    '^@gadow/types$': require.resolve('@gadow/types')
  }
}
