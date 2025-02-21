#!/usr/bin/env node

import yargs from "yargs";
import { hideBin } from "yargs/helpers";

import { fetchFigmaVariables } from "./fetchFigmaVariables";
import { updateCssVariables } from "./figmaToColor";

const argv = yargs(hideBin(process.argv))
  .usage("Usage: npx figmable -fileKey FILE_KEY -token API_TOKEN -output OUTPUT_JSON -path CSS_PATH")
  .option("fileKey", {
    description: "Figma File Key (e.g., -fileKey abc123)",
    type: "string",
    demandOption: true,
  })
  .option("token", {
    alias: "FIGMA_API_TOKEN",
    description: "Figma API Token (e.g., -token=your-api-token)",
    type: "string",
    demandOption: true,
  })
  .option("output", {
    alias: "outputJsonPath",
    description:
      "Path to save figma variables JSON (default: ./figma-variables.json, e.g., -output ./path/to/output.json)",
    type: "string",
    default: "./figma-variables.json",
  })
  .option("path", {
    alias: "cssFilePath",
    description: "Path to the CSS file to update (e.g., -path src/app/global.css)",
    type: "string",
    demandOption: true,
  })
  .help()
  .alias("h", "help").argv as {
  fileKey: string;
  token: string;
  output: string;
  path: string;
};

const main = async () => {
  console.log("Command Arguments:", argv);
  console.log("CSS File Path:", argv.path);

  fetchFigmaVariables({
    FIGMA_FILE_KEY: argv.fileKey,
    FIGMA_API_TOKEN: argv.token,
    outputJsonPath: argv.output,
  })
    .then(() => {
      console.log("Figma variables fetched successfully!");
      return updateCssVariables({ cssFilePath: argv.path, jsonFilePath: argv.output });
    })
    .catch((error) => {
      console.error("Error fetching Figma variables:", error);
    });
};

main();
