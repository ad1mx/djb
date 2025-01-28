import {
  log
} from "./chunk-SZ4WLV4Y.mjs";

// src/lib/mongo.ts
import mongoose from "mongoose";
var connectToDb = async (uri) => {
  try {
    const c = await mongoose.connect(uri, { connectTimeoutMS: 5e4 });
    log.success(
      "mongodb",
      `Connected to database '${c.connection.name}' successfully.`
    );
  } catch (error) {
    log.error("mongodb", error);
  }
};

export {
  connectToDb
};
