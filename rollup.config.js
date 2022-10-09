import typescript from 'rollup-plugin-typescript2'
import commonjs from '@rollup/plugin-commonjs'
import resolve from '@rollup/plugin-node-resolve'
import babel from '@rollup/plugin-babel'
import pkg from './package.json'
import json from '@rollup/plugin-json'
import { preserveShebangs } from 'rollup-plugin-preserve-shebangs'
import externals from 'rollup-plugin-node-externals'

const babelOpt = {
  extensions: ['.js', '.ts'],
  babelHelpers: 'runtime',
  exclude: 'node_modules/**',
  include: ['src/**/*'],
  presets: [
    [
      '@babel/preset-env',
      {
        targets: {
          node: '10.0',
        },
      },
    ],
  ],
}

export default [
  {
    input: 'src/index.ts',
    external: Object.keys(pkg.dependencies),
    output: [{ file: pkg.main, format: 'cjs' }],
    plugins: [
      externals({
        builtins: true,
        deps: true,
        peerDeps: true,
        optDeps: true,
        devDeps: true,
      }),
      preserveShebangs(),
      json(),
      typescript(),
      resolve(),
      commonjs(),
      babel(babelOpt),
    ],
  },
]
