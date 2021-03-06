import path from "path";

if (process.env.NODE_ENV !== "production") {
  const { default: dotenv } = await import("dotenv");
  dotenv.config({
    path: path.resolve(process.cwd(), "./src/config.env"),
  });
}

const NECESSARY_VARS = [
  "TOKEN_EXPIRATION",
  "PORT",
  "MONGO_DB_URI",
  "REDIS_NAMESPACE",
  "CLIENT_DOMAIN",
];
NECESSARY_VARS.forEach((v) => {
  if (!process.env[v]) throw new Error(`${v} is undefined`);
});

// top level import causes bug in development mode, because dotenv config hadn't been resolved yet
const { default: startExpressApp } = await import(
  "./adapters/express-adapter/index.js"
);
await startExpressApp();
