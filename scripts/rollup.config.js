const { babel } = require('@rollup/plugin-babel')
const typescript = require('@rollup/plugin-typescript')
const commonjs = require('@rollup/plugin-commonjs')
const resolve = require('@rollup/plugin-node-resolve')
const json = require('@rollup/plugin-json')
const terser = require('@rollup/plugin-terser')
const fs = require('fs')
const path = require('path')

function getConfig(format, filename, { minify } = {}) {
  const dir = process.cwd()
  const pkg = fs.readFileSync(path.join(dir, 'package.json'), 'utf-8')
  const { name } = JSON.parse(pkg)
  return {
    input: 'src/index',
    output: {
      format,
      file: `dist/${filename}`,
      sourcemap: true,
      ...(format === 'umd' ? { name } : {})
    },
    plugins: [
      resolve({
        extensions: ['.ts', '.tsx']
      }),
      typescript({
        tsconfig: path.join(dir, 'tsconfig.json'),
        exclude: ['__tests__']
      }),
      commonjs(),
      babel({
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
        babelHelpers: 'bundled',
        presets: ['@babel/preset-env', '@babel/preset-typescript'],
        exclude: '/node_modules/'
      }),
      json(),
      ...(minify ? [terser()] : [])
    ]
  }
}

const getRollupConfigs = transform => {
  const configs = [
    getConfig('esm', 'index.js'),
    getConfig('cjs', 'index.cjs.js'),
    getConfig('umd', 'index.umd.js'),
    getConfig('umd', 'index.umd.min.js', { minify: true })
  ]
  return typeof transform === 'function'
    ? transform(configs, getConfig)
    : configs
}

module.exports = {
  getRollupConfigs
}
