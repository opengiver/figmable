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
export const fetchFigmaVariables = async (argv: FigmaFetchArgs): Promise<string> => {
  const { FIGMA_FILE_KEY, FIGMA_API_TOKEN, outputJsonPath } = argv;

  try {
    const response = await axios.get<FigmaResponse>(`https://api.figma.com/v1/files/${FIGMA_FILE_KEY}`, {
      headers: {
        "X-FIGMA-TOKEN": FIGMA_API_TOKEN,
      },
    });

    const figmaData = response.data;
    if (!figmaData.document) {
      throw new Error("Figma document 데이터를 찾을 수 없습니다.");
    }

    const extractColors = (node: FigmaNode, accumulatedColors: Record<string, string>): Record<string, string> => {
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

    const outputDir = fs.lstatSync(outputJsonPath).isDirectory() ? outputJsonPath : path.dirname(outputJsonPath); // path.dirname 사용

    if (!fs.existsSync(outputDir)) {
      console.log(`❌ ${outputDir} 디렉토리가 존재하지 않습니다. 디렉토리를 생성합니다.`);
      fs.mkdirSync(outputDir, { recursive: true });
    }

    const outputPath = outputJsonPath.endsWith(".json") ? outputJsonPath : `${outputDir}/figma-variables.json`;
    fs.writeFileSync(outputPath, JSON.stringify(colors, null, 2));

    return outputPath; // JSON 파일 경로 반환
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 403) {
        throw new Error("Figma API 토큰이 유효하지 않거나 파일에 대한 접근 권한이 없습니다.");
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
