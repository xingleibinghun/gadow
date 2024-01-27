import { babel } from '@rollup/plugin-babel'
import rollupTypescript from 'rollup-plugin-typescript2'
import commonjs from '@rollup/plugin-commonjs'
import resolve from '@rollup/plugin-node-resolve'
import json from '@rollup/plugin-json'
import terser from '@rollup/plugin-terser'
import { DEFAULT_EXTENSIONS } from '@babel/core'
import { name } from './package.json'

function getConfig(format, filename, { includesTypes, minify } = {}) {
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
        extensions: [...DEFAULT_EXTENSIONS, '.ts', '.tsx']
      }),
      ...(includesTypes
        ? [
          rollupTypescript()
        ]
        : []),
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

const configs = [
  getConfig('esm', 'index.js', { includesTypes: true }),
  // getConfig('cjs', 'index.cjs.js'),
  // getConfig('umd', 'index.umd.js'),
  // getConfig('umd', 'index.umd.min.js', { minify: true })
]

export default configs
