import fs from "node:fs";
import path from "node:path";
import { DJBClient, ClientConfig } from "../djb";
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

  const configFiledata = await import(configPath);

  return configFiledata?.config;
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
      const fileData = await import(entryPath);

      const resolvedFiledata = fileData.default?.default
        ? fileData.default
        : fileData;

      const file: HandlerFile<T> = {
        parent: path.basename(dirPath),
        name: entry.name.replace(
          new RegExp(`\\.(${EXT_PRIORITY.join("|")})$`),
          ""
        ),
        data: {
          config: resolvedFiledata?.config,
          execute:
            resolvedFiledata?.default &&
            typeof resolvedFiledata.default === "function"
              ? resolvedFiledata.default
              : undefined,
        } as T,
      };

      fileMap.set(baseName, file); // Store only the highest-priority extension
    }
  }

  return fileMap.values();
};

export const initHandlers = async (client: DJBClient) => {
  const handlersPath = path.join(getCurrenDir(), "handlers");

  if (!fs.existsSync(handlersPath)) {
    return [];
  }

  const handlerFiles = fs
    .readdirSync(handlersPath)
    .filter((v) => v.endsWith(".js"));

  for (const handlerFile of handlerFiles) {
    const filePath = path.join(handlersPath, handlerFile);
    const handlerFileData = await import(filePath);

    const handlerFunction =
      handlerFileData.default?.default ?? handlerFileData.default;

    if (!handlerFunction || typeof handlerFunction !== "function")
      throw new Error(
        `${handlerFile} missing required default execute function.`
      );

    await handlerFunction(client, getAppPath());
  }
};
