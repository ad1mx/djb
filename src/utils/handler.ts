import fs from "node:fs";
import path from "node:path";
import { Client, ClientConfig } from "../types/client";
import { getAppPath, getCurrenDir } from "./url";

export type HandlerFile<T> = {
  parent: string;
  name: string;
  data: T;
};

const EXT_PRIORITY = ["js", "mjs", "cjs"];

export const getClientConfig = async (): Promise<ClientConfig | undefined> => {
  const dirPath = path.join(getAppPath(), "..");

  if (!fs.existsSync(dirPath)) return;

  // Select the best matching config file based on EXT_PRIORITY
  const configFile = fs
    .readdirSync(dirPath, { withFileTypes: true })
    .filter((entry) => entry.isFile())
    .find((entry) => {
      return EXT_PRIORITY.some((ext) => entry.name.endsWith(`.${ext}`));
    });

  if (!configFile)
    throw new Error(
      `No config file found, please mrovide a valid config.js file.` +
        `\nValid extentions: ${EXT_PRIORITY.join(",")}`
    );

  const configPath = path.join(dirPath, configFile.name);

  const config = await import(configPath);
  const resolvedConfig = config.default?.config ?? config.config;

  return resolvedConfig;
};

export const loadFiles = async <T>(dirPath: string) => {
  if (!fs.existsSync(dirPath)) return [];

  const entries = fs.readdirSync(dirPath, {
    withFileTypes: true,
    recursive: true,
  });
  const fileMap = new Map<string, HandlerFile<T>>();

  for (const entry of entries) {
    if (entry.isDirectory()) continue;

    const match = entry.name.match(/^(.+)\.([^.]+)$/);
    if (!match) continue;

    const [, baseName, ext] = match;
    if (!EXT_PRIORITY.includes(ext)) continue; // Ignore non-priority extensions

    const existingEntry = fileMap.get(baseName);
    if (
      !existingEntry ||
      EXT_PRIORITY.indexOf(ext) <
        EXT_PRIORITY.indexOf(existingEntry.name.split(".").pop()!)
    ) {
      const entryPath = path.join(entry.parentPath, entry.name);
      const { default: fileData } = await import(entryPath);

      const file: HandlerFile<T> = {
        parent: path.basename(dirPath),
        name: entry.name.replace(
          new RegExp(`\\.(${EXT_PRIORITY.join("|")})$`),
          ""
        ),
        data: {
          config: fileData.config,
          execute: fileData.default,
        } as T,
      };

      fileMap.set(baseName, file); // Store only the highest-priority extension
    }
  }

  return fileMap.values();
};

export const initHandlers = async (client: Client) => {
  const handlersPath = path.join(getCurrenDir(), "handlers");

  console.log(handlersPath);

  if (!fs.existsSync(handlersPath)) {
    return [];
  }

  const handlerFiles = fs
    .readdirSync(handlersPath)
    .filter((v) => v.endsWith(".js"));

  for (const handlerFile of handlerFiles) {
    const filePath = path.join(handlersPath, handlerFile);
    const handlerFileData = await import(filePath);

    const handler = handlerFileData.default?.default ?? handlerFileData.default;

    await handler(client, getAppPath());
  }
};
