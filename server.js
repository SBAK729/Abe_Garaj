import mongoose from "mongoose";
import dotenv from "dotenv";
import app from "./app.js";

dotenv.config({ path: "./config.env" });

const db = process.env.DATABASE;
const port = process.env.PORT;

mongoose.connect(db).then((conn) => {
  console.log("Database is successfully connected!!");
});

const server = app.listen(port, () => {
  console.log(`The app is running on port ${port}!!`);
});
