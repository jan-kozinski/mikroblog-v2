import express from "express";
import { postUser } from "../../controllers/user-controller/index.js";
import makeCallback from "./make-express-callback.js";

export default function start() {
  const app = express();

  // CONFIG
  const PORT = process.env.PORT || 3000;

  // MIDDLEWARE
  app.use(express.json());
  // ROUTES
  app.post("/api/user", makeCallback(postUser));

  app.listen(PORT, () => {
    console.log(
      `Srever is listening on port ${PORT} in ${process.env.NODE_ENV} mode`
    );
  });
}
