import {
  getCurrenDir
} from "./chunk-L7GWEIC4.mjs";

// src/utils/handler.ts
import fs from "node:fs";
import path from "node:path";
var getClientConfig = async () => {
  const configPath = path.join(process.cwd(), "dist", "config.js");
  if (!fs.existsSync(configPath)) return;
  const config = await import(configPath);
  const resolvedConfig = config.default.config ?? config.config;
  return resolvedConfig;
};
var loadFiles = async (dirPath) => {
  if (!fs.existsSync(dirPath)) {
    return [];
  }
  const entries = fs.readdirSync(dirPath, { withFileTypes: true }).filter((v) => v.isDirectory() || /\.(js)$/.test(v.name));
  const filesArr = [];
  for (const entry of entries) {
    const entryPath = path.join(dirPath, entry.name);
    if (entry.isDirectory()) {
      const nestedFiles = await loadFiles(entryPath);
      filesArr.push(...nestedFiles);
    } else {
      const fileData = await import(entryPath);
      const resolvedFileData = fileData.default.default ? fileData.default : fileData;
      filesArr.push({
        parent: path.basename(dirPath),
        name: entry.name.replace(/\.(js|mjs)$/, ""),
        data: {
          config: resolvedFileData.config,
          execute: resolvedFileData.default
        }
      });
    }
  }
  return filesArr;
};
var initHandlers = async (client) => {
  const handlersPath = path.join(getCurrenDir(), "handlers");
  if (!fs.existsSync(handlersPath)) {
    return [];
  }
  const handlerFiles = fs.readdirSync(handlersPath).filter((v) => v.endsWith(".js"));
  for (const handlerFile of handlerFiles) {
    const filePath = path.join(handlersPath, handlerFile);
    const {
      default: { default: handler }
    } = await import(filePath);
    await handler(client);
  }
};

export {
  getClientConfig,
  loadFiles,
  initHandlers
};
