#!/usr/bin/env node
import { exec } from "node:child_process";
import { version, description } from "../../package.json";
import { program } from "commander";
import { djbStart } from "../cli/djb-start";
import { djbCreate } from "../cli/djb-create";

program.version(version).description(description);

program.command("start").description("Start the bot app").action(djbStart);

program
  .command("create [project-name]")
  .description("Create a new DJB project")
  .action((projectName) => {
    djbCreate(projectName);
  });

program.parse(process.argv);
