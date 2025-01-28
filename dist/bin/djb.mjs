#!/usr/bin/env node
import {
  djbCreate
} from "../chunk-YRMOYJ7O.mjs";
import {
  djbStart
} from "../chunk-32GVA7CV.mjs";
import "../chunk-X2OW7V5R.mjs";
import "../chunk-ZG4V63Y2.mjs";
import "../chunk-SZ4WLV4Y.mjs";
import "../chunk-GSQTZ7DG.mjs";
import "../chunk-6TLBDZDO.mjs";
import "../chunk-L7GWEIC4.mjs";

// package.json
var version = "1.2.3";
var description = "A streamlined library for creating Discord bots with Discord.js, featuring a simple command and event handler structure.";

// src/bin/djb.ts
import { program } from "commander";
program.version(version).description(description);
program.command("start").description("Start the bot app").action(djbStart);
program.command("create [project-name]").description("Create a new DJB project").action((projectName) => {
  djbCreate(projectName);
});
program.parse(process.argv);
