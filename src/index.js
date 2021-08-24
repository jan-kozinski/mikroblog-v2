import startExpressApp from "./adapters/express-adapter/index.js";
import path from "path";

if (process.env.NODE_ENV === "development") {
  const { default: dotenv } = await import("dotenv");
  dotenv.config({
    path: path.resolve(process.cwd(), "./src/config.env"),
  });
}
const NECESSARY_VARS = ["JWT_SECRET", "TOKEN_EXPIRATION"];
NECESSARY_VARS.forEach((v) => {
  if (!process.env[v]) throw new Error(`${v} is undefined`);
});

await startExpressApp();
