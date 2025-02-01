import { fileURLToPath } from "url";
import { dirname, join } from "path";
import { existsSync } from "fs";

export const getCurrentModuleType = () => {
  if (typeof __dirname !== "undefined") {
    return "cjs";
  } else if (typeof import.meta?.url !== "undefined") {
    // ESM
    return "esm";
  } else {
    throw new Error("Unable to determine module type.");
  }
};

export const getCurrenDir = () => {
  const mType = getCurrentModuleType();

  switch (mType) {
    case "cjs":
      return __dirname;

    case "esm":
      return dirname(fileURLToPath(import.meta?.url));
  }
};

export const getAppPath = () => {
  const distAppPath = join(process.cwd(), "dist", "app");
  const appPath = join(process.cwd(), "app");

  if (existsSync(distAppPath)) return distAppPath;
  else if (existsSync(appPath)) return appPath;
  else throw new Error("No /app directory found.");
};
