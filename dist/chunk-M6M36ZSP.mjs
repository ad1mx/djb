import {
  initHandlers
} from "./chunk-6TLBDZDO.mjs";
import {
  connectToDb
} from "./chunk-ZG4V63Y2.mjs";
import {
  log
} from "./chunk-SZ4WLV4Y.mjs";
import {
  Client
} from "./chunk-GSQTZ7DG.mjs";

// src/djb.ts
import "dotenv/config";
import { Collection } from "discord.js";
import express from "express";
import { createServer } from "http";
var DJBClient = class {
  client;
  app;
  server;
  djbOptions;
  constructor(options, djbOptions) {
    this.client = new Client(options);
    this.djbOptions = djbOptions;
    this.app = express();
    this.server = createServer(this.app);
  }
  setupServer() {
    this.app.get("/", (req, res) => {
      res.send("Hello world!");
    });
    const port = process.env.DJB_PORT || 3e3;
    this.server.listen(port, () => {
      log.success("server", `App is running on port '${port}'`);
    });
  }
  setupClient() {
    this.client.commands = new Collection();
    initHandlers(this.client);
  }
  setupDatabase() {
    if (!process.env.DJB_MONGODB_URI)
      throw new Error("MONGODB_URI env must be provided when mongoDb is true");
    connectToDb(process.env.DJB_MONGODB_URI ?? "");
  }
  start() {
    this.setupServer();
    if (this.djbOptions?.mongoDb) this.setupDatabase();
    this.setupClient();
    if (!process.env.DJB_TOKEN)
      throw new Error("DJB_TOKEN env must be provided");
    this.client.login(process.env.DJB_TOKEN);
  }
};

export {
  DJBClient
};
