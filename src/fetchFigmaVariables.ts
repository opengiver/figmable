/**
 * Module for fetching color variables from Figma
 * @module fetchFigmaVariables
 */

import * as fs from "fs";
import * as path from "path";
import axios from "axios";

/**
 * Arguments for Figma API fetch operation
 * @interface FigmaFetchArgs
 */
interface FigmaFetchArgs {
  /** Figma file key from the file URL */
  FIGMA_FILE_KEY: string;
  /** Figma API access token */
  FIGMA_API_TOKEN: string;
  /** Path to save the JSON output */
  outputJsonPath: string;
}

/**
 * Figma node structure from API response
 * @interface FigmaNode
 */
interface FigmaNode {
  /** Node name */
  name?: string;
  /** Child nodes */
  children?: FigmaNode[];
  /** Fill styles including colors */
  fills?: { color?: { r: number; g: number; b: number } }[];
}

/**
 * Figma API response structure
 * @interface FigmaResponse
 */
interface FigmaResponse {
  /** Root document node */
  document?: FigmaNode;
}

/**
 * Fetches color variables from Figma and saves them to a JSON file
 * @param {FigmaFetchArgs} argv - Arguments for the fetch operation
 * @returns {Promise<string>} Path to the saved JSON file
 */
export const fetchFigmaVariables = async (
  argv: FigmaFetchArgs
): Promise<string> => {
  const { FIGMA_FILE_KEY, FIGMA_API_TOKEN, outputJsonPath } = argv;

  try {
    const response = await axios.get<FigmaResponse>(
      `https://api.figma.com/v1/files/${FIGMA_FILE_KEY}/variables/local`,
      {
        headers: {
          "X-FIGMA-TOKEN": FIGMA_API_TOKEN,
        },
      }
    );

    const figmaData = response.data;
    if (!figmaData.document) {
      throw new Error("Figma document data could not be found.");
    }

    const extractColors = (
      node: FigmaNode,
      accumulatedColors: Record<string, string>
    ): Record<string, string> => {
      if (!node.children) return accumulatedColors;

      return node.children.reduce((acc, child) => {
        if (child.fills && child.fills[0]?.color) {
          const { r, g, b } = child.fills[0].color;
          const hexColor = rgbToHex(r, g, b);

          if (child.name && child.name.startsWith("--")) {
            const colorName = child.name.toLowerCase();
            if (!acc[colorName]) {
              acc[colorName] = hexColor;
            }
          }
        }
        return { ...acc, ...extractColors(child, acc) };
      }, accumulatedColors);
    };

    const colors = extractColors(figmaData.document, {});

    let outputDir;
    let outputPath;

    try {
      if (fs.existsSync(outputJsonPath)) {
        const stats = fs.statSync(outputJsonPath);
        outputDir = stats.isDirectory()
          ? outputJsonPath
          : path.dirname(outputJsonPath);
        outputPath = stats.isDirectory()
          ? `${outputJsonPath}/figma-variables.json`
          : outputJsonPath;
      } else {
        if (outputJsonPath.endsWith(".json")) {
          outputDir = path.dirname(outputJsonPath);
          outputPath = outputJsonPath;
        } else {
          outputDir = outputJsonPath;
          outputPath = `${outputJsonPath}/figma-variables.json`;
        }
      }
    } catch (error) {
      outputDir = "./";
      outputPath = "./figma-variables.json";
    }

    if (!fs.existsSync(outputDir)) {
      console.log(
        `❌ The directory ${outputDir} does not exist. Creating the directory.`
      );
      fs.mkdirSync(outputDir, { recursive: true });
    }

    fs.writeFileSync(outputPath, JSON.stringify(colors, null, 2));

    return outputPath;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 403) {
        throw new Error(
          "The Figma API token is invalid or you do not have access to the file."
        );
      }
    }
    throw error;
  }
};

/**
 * Converts RGB values to hexadecimal color string
 * @param {number} r - Red value (0-1)
 * @param {number} g - Green value (0-1)
 * @param {number} b - Blue value (0-1)
 * @returns {string} Hexadecimal color string
 */
const rgbToHex = (r: number, g: number, b: number): string => {
  const toHex = (x: number): string => {
    const hex = Math.round(x * 255).toString(16);
    return hex.length === 1 ? "0" + hex : hex;
  };
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
};
