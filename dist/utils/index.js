"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/utils/index.ts
var utils_exports = {};
__export(utils_exports, {
  getCurrenDir: () => getCurrenDir
});
module.exports = __toCommonJS(utils_exports);
var import_url = require("url");
var import_path = require("path");
var import_meta = {};
var getCurrenDir = () => {
  if (typeof __dirname !== "undefined") {
    return __dirname;
  } else if (typeof import_meta.url !== "undefined") {
    return (0, import_path.dirname)((0, import_url.fileURLToPath)(import_meta.url));
  } else {
    throw new Error("Unable to determine module type.");
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  getCurrenDir
});
