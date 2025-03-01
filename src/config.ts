/**
 * Configuration module for Figmable
 * @module config
 */

import * as fs from "fs";
import * as path from "path";
import * as os from "os";

/**
 * Configuration interface for Figmable
 * @interface Config
 */
interface Config {
  /** Figma file key from the file URL */
  FIGMA_FILE_KEY: string;
  /** Figma API access token */
  FIGMA_API_TOKEN: string;
  /** Path to the CSS file to update */
  cssFilePath: string;
  /** Path to save the Figma variables JSON (optional) */
  outputJsonPath?: string;
}

/** Name of the configuration file */
const CONFIG_FILE = ".figmablerc";

/** Possible paths for the configuration file */
const CONFIG_PATHS = [path.join(process.cwd(), CONFIG_FILE), path.join(os.homedir(), CONFIG_FILE)];

/**
 * Retrieves the configuration from the config file
 * @returns {Config | null} The configuration object or null if not found
 */
export const getConfig = (): Config | null => {
  for (const configPath of CONFIG_PATHS) {
    if (fs.existsSync(configPath)) {
      try {
        return JSON.parse(fs.readFileSync(configPath, "utf-8"));
      } catch (err) {
        console.error(`Error reading configuration file (${configPath}):`, err);
      }
    }
  }
  return null;
};

/**
 * Saves the configuration to the config file
 * @param {Config} config - The configuration object to save
 */
export const saveConfig = (config: Config): void => {
  const configPath = path.join(os.homedir(), CONFIG_FILE);
  try {
    fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
    console.log(`✅ Configuration saved: ${configPath}`);
  } catch (err) {
    console.error("Error saving configuration:", err);
  }
};
