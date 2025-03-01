/**
 * Rollup configuration for building Figmable
 * @module rollup.config
 */

import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import typescript from "@rollup/plugin-typescript";
import json from "@rollup/plugin-json";
import terser from "@rollup/plugin-terser";

export default {
  input: "src/index.ts",
  output: [
    {
      file: "dist/index.js",
      format: "es",
      sourcemap: true,
    },
    {
      file: "dist/cjs/index.cjs",
      format: "cjs",
      sourcemap: true,
    },
  ],
  plugins: [
    resolve({
      preferBuiltins: true,
    }),
    commonjs({
      transformMixedEsModules: true,
      ignore: ["conditional-runtime-dependency"],
    }),
    typescript({
      tsconfig: "./tsconfig.json",
      declaration: true,
      declarationDir: "./dist/cjs",
    }),
    json(),
    terser(),
  ],
  external: ["yargs", "yargs/helpers", "path", "fs", "os", "child_process", "axios", "ora"],
  treeshake: true,
  watch: {
    include: "src/**",
    exclude: "node_modules/**",
    clearScreen: false,
  },
};
