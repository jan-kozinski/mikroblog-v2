import startExpressApp from "./adapters/express-adapter/index.js";
import dotenv from "dotenv";
import path from "path";

dotenv.config({
  path: path.resolve(process.cwd(), "./src/config.env"),
});

const NECESSARY_VARS = ["JWT_SECRET", "TOKEN_EXPIRATION"];

NECESSARY_VARS.forEach((v) => {
  if (!process.env[v]) throw new Error(`${v} is undefined`);
});

startExpressApp();
