import { babel } from '@rollup/plugin-babel'
import typescript from '@rollup/plugin-typescript'
import commonjs from '@rollup/plugin-commonjs'
import resolve from '@rollup/plugin-node-resolve'
import json from '@rollup/plugin-json'
import terser from '@rollup/plugin-terser'
import { DEFAULT_EXTENSIONS } from '@babel/core'
import fs from 'fs'
import path from 'path'

function getConfig(format, filename, { includesTypes, minify } = {}) {
  const pkg = fs.readFileSync(path.join(__dirname, 'package.json'), 'utf-8')
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
        extensions: [...DEFAULT_EXTENSIONS, '.ts', '.tsx']
      }),
      ...(includesTypes
        ? [
            typescript({
              tsconfig: path.join(__dirname, 'tsconfig.json'),
              exclude: ['__tests__']
            })
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

export const getRollupConfigs = () => {
  return [
    getConfig('esm', 'index.js', { includesTypes: true }),
    getConfig('cjs', 'index.cjs.js'),
    getConfig('umd', 'index.umd.js'),
    getConfig('umd', 'index.umd.min.js', { minify: true })
  ]
}
