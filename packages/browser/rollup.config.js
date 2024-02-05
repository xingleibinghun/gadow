const { getRollupConfigs } = require('../../scripts/rollup.config')

const rollupConfigs = getRollupConfigs((configs, getConfig) => {
  const config = getConfig('umd', 'index.trace.umd.min.js', { minify: true })
  config.input = 'src/index.trace'
  configs.push(config)
  return configs
})

module.exports = rollupConfigs
