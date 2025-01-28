#!/usr/bin/env node
import {
  djbCreate
} from "../chunk-YRMOYJ7O.mjs";
import {
  djbStart
} from "../chunk-O4HXASEL.mjs";
import "../chunk-M6M36ZSP.mjs";
import "../chunk-6TLBDZDO.mjs";
import "../chunk-L7GWEIC4.mjs";
import "../chunk-ZG4V63Y2.mjs";
import "../chunk-SZ4WLV4Y.mjs";
import "../chunk-GSQTZ7DG.mjs";

// package.json
var version = "1.0.0-28";
var description = "";

// src/bin/djb.ts
import { program } from "commander";
program.version(version).description(description);
program.command("start").description("Start the bot app").action(djbStart);
program.command("create [project-name]").description("Create a new DJB project").action((projectName) => {
  djbCreate(projectName);
});
program.parse(process.argv);
