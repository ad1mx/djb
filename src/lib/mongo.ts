import mongoose from "mongoose";
import { log } from "./logger";

export const connectToDb = async (uri: string) => {
  try {
    const c = await mongoose.connect(uri, { connectTimeoutMS: 50000 });

    log.success(
      "mongodb",
      `Connected to database '${c.connection.name}' successfully.`
    );
  } catch (error) {
    log.error("mongodb", error);
  }
};
