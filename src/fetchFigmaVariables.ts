import * as fs from "fs";
import * as path from "path";
import axios from "axios";

interface FigmaFetchArgs {
  FIGMA_FILE_KEY: string;
  FIGMA_API_TOKEN: string;
  outputJsonPath: string;
}

interface FigmaNode {
  name?: string;
  children?: FigmaNode[];
  fills?: { color?: { r: number; g: number; b: number } }[];
}

interface FigmaResponse {
  document?: FigmaNode;
}

export const fetchFigmaVariables = async (argv: FigmaFetchArgs): Promise<void> => {
  const { FIGMA_FILE_KEY, FIGMA_API_TOKEN, outputJsonPath } = argv;

  try {
    console.log("Fetching Figma variables for file:", FIGMA_FILE_KEY);
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

    console.log(`✅ Figma Variables가 ${outputPath}에 성공적으로 저장되었습니다!`);
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("❌ Figma Variables 가져오기 실패:", error.message);
    } else {
      console.error("❌ Figma Variables 가져오기 실패:", error);
    }
  }
};

const rgbToHex = (r: number, g: number, b: number): string => {
  const toHex = (x: number): string => {
    const hex = Math.round(x * 255).toString(16);
    return hex.length === 1 ? "0" + hex : hex;
  };
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
};
