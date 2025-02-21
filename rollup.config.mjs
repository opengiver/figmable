import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import typescript from "@rollup/plugin-typescript";
import json from "@rollup/plugin-json";

export default {
  input: "src/index.ts",
  output: [
    {
      file: "dist/cjs/index.cjs",
      format: "cjs",
    },
    {
      file: "dist/index.js",
      format: "esm",
    },
  ],
  plugins: [
    resolve(),
    commonjs({
      transformMixedEsModules: true,
    }),
    typescript({
      tsconfig: "./tsconfig.json",
      declaration: true,
      declarationDir: "./dist/cjs",
    }),
    json(),
  ],
};
