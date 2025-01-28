import { fileURLToPath } from "url";
import { dirname } from "path";

export const getCurrenDir = () => {
  if (typeof __dirname !== "undefined") {
    // CommonJS
    return __dirname;
  } else if (typeof import.meta.url !== "undefined") {
    // ESM
    return dirname(fileURLToPath(import.meta.url));
  } else {
    throw new Error("Unable to determine module type.");
  }
};
