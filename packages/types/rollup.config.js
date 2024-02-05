// import { getRollupConfigs } from '../../scripts/rollup.config'
//
// const rollupConfigs = getRollupConfigs()
//
// export default rollupConfigs

const { getRollupConfigs } = require('../../scripts/rollup.config')

const rollupConfigs = getRollupConfigs()

module.exports = rollupConfigs
