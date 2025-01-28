import fs from "node:fs";
import path from "node:path";
import { Client, ClientConfig } from "../types/client";
import { getCurrenDir } from ".";

export type HandlerFile<T> = {
  parent: string;
  name: string;
  data: T;
};

export const getClientConfig = async (): Promise<ClientConfig | undefined> => {
  const configPath = path.join(process.cwd(), "dist", "config.js");

  if (!fs.existsSync(configPath)) return;

  const config = await import(configPath);
  const resolvedConfig = config.default.config ?? config.config;

  return resolvedConfig;
};

export const loadFiles = async <T>(dirPath: string) => {
  if (!fs.existsSync(dirPath)) {
    return [];
  }

  const entries = fs
    .readdirSync(dirPath, { withFileTypes: true })
    .filter((v) => v.isDirectory() || /\.(js)$/.test(v.name));

  const filesArr: HandlerFile<T>[] = [];

  for (const entry of entries) {
    const entryPath = path.join(dirPath, entry.name);

    if (entry.isDirectory()) {
      const nestedFiles = await loadFiles<T>(entryPath);

      filesArr.push(...nestedFiles);
    } else {
      const fileData = await import(entryPath);

      const resolvedFileData = fileData.default.default
        ? fileData.default
        : fileData;

      filesArr.push({
        parent: path.basename(dirPath),
        name: entry.name.replace(/\.(js|mjs)$/, ""),
        data: {
          config: resolvedFileData.config,
          execute: resolvedFileData.default,
        } as T,
      });
    }
  }

  return filesArr;
};

export const initHandlers = async (client: Client) => {
  const handlersPath = path.join(getCurrenDir(), "handlers");

  if (!fs.existsSync(handlersPath)) {
    return [];
  }

  const handlerFiles = fs
    .readdirSync(handlersPath)
    .filter((v) => v.endsWith(".js"));

  for (const handlerFile of handlerFiles) {
    const filePath = path.join(handlersPath, handlerFile);
    const {
      default: { default: handler },
    } = await import(filePath);

    await handler(client);
  }
};
