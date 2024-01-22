import { babel } from '@rollup/plugin-babel'
import commonjs from '@rollup/plugin-commonjs'
import resolve from '@rollup/plugin-node-resolve'
import json from '@rollup/plugin-json'

export default {
  input: 'src/index',
  output: [
    {
      file: 'dist/index.js',
      format: 'esm',
      sourcemap: true
    }
  ],
  plugins: [
    resolve({
      extensions: ['.js', '.jsx', '.ts', '.tsx', '.json']
    }),
    commonjs(),
    babel({
      extensions: ['.js', '.jsx', '.ts', '.tsx'],
      babelHelpers: 'bundled',
      presets: ['@babel/preset-env', '@babel/preset-typescript'],
      exclude: 'node_modules/**'
    }),
    json()
  ]
}
