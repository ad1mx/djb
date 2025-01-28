// src/utils/index.ts
import { fileURLToPath } from "url";
import { dirname } from "path";
var getCurrenDir = () => {
  if (typeof __dirname !== "undefined") {
    return __dirname;
  } else if (typeof import.meta.url !== "undefined") {
    return dirname(fileURLToPath(import.meta.url));
  } else {
    throw new Error("Unable to determine module type.");
  }
};

export {
  getCurrenDir
};
