import * as fs from "fs";

interface Argv {
  cssFilePath: string;
  jsonFilePath: string;
}

export const updateCssVariables = (argv: Argv): void => {
  const { cssFilePath, jsonFilePath } = argv;

  let figmaVariables: Record<string, string>;
  try {
    figmaVariables = JSON.parse(fs.readFileSync(jsonFilePath, "utf-8"));
  } catch (err) {
    console.error(`Error reading JSON file at ${jsonFilePath}:`, err);
    return;
  }

  let globalCss: string;
  try {
    globalCss = fs.readFileSync(cssFilePath, "utf-8");
  } catch (err) {
    console.error(`Error reading CSS file at ${cssFilePath}:`, err);
    return;
  }

  const existingVariables: Set<string> = new Set();

  const rootContentMatch: RegExpMatchArray | null = globalCss.match(/@layer base \{\s*:root \{([^}]*)\}/);

  if (rootContentMatch) {
    const rootContent: string = rootContentMatch[1];
    const regex: RegExp = /--[\w-]+\s*:\s*[^;]+;/g;
    const existingVars: RegExpMatchArray | null = rootContent.match(regex);

    if (existingVars) {
      existingVars.forEach((varDeclaration: string) => {
        const varName: string = varDeclaration.split(":")[0].trim();
        existingVariables.add(varName);
      });
    }
  }

  const generateCssVariables = (colors: Record<string, string>, existingVariables: Set<string>): string => {
    let cssVariables: string = "";

    for (const [key, value] of Object.entries(colors)) {
      if (key.startsWith("--") && !existingVariables.has(key)) {
        cssVariables += `    ${key}: ${value};\n`;
      }
    }

    return cssVariables;
  };

  const updatedCss: string = globalCss.replace(
    /@layer base \{\s*:root \{([^}]*)\}/,
    (match: string, rootContent: string) => {
      const newVariables: string = generateCssVariables(figmaVariables, existingVariables);
      return match.replace(rootContent, `${rootContent}\n${newVariables}`);
    }
  );

  const backupFilePath = `${cssFilePath}.bak`;
  fs.copyFileSync(cssFilePath, backupFilePath);
  fs.writeFileSync(cssFilePath, updatedCss);

  console.log(`✅ ${cssFilePath}가 성공적으로 업데이트되었습니다! 백업은 ${backupFilePath}에 저장되었습니다.`);
};
