#!/usr/bin/env node
import { version, description } from "@/package.json";
import { program } from "commander";
import { djbStart } from "@/src/cli/djb-start";
import { djbCreate } from "@/src/cli/djb-create";

program.version(version).description(description);

program.command("start").description("Start the bot app").action(djbStart);

program
  .command("create [project-name]")
  .description("Create a new DJB project")
  .action((projectName) => {
    djbCreate(projectName);
  });

program.parse(process.argv);
