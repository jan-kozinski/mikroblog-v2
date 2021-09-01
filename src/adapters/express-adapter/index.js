import cookieParser from "cookie-parser";
import express from "express";
import makeCallback from "./make-express-callback.js";
import helmet from "helmet";
import { postUser, signUser } from "../../controllers/user-controller/index.js";
import {
  addPost,
  updatePost,
  getPosts,
  likePost,
  unlikePost,
} from "../../controllers/post-controller/index.js";

let server;

export default async function start() {
  const app = express();

  // CONFIG
  const PORT = process.env.PORT || 3000;

  // MIDDLEWARE
  app.use(express.json());
  app.use(cookieParser());
  app.use(helmet());
  if (process.env.NODE_ENV === "development") {
    const { default: morgan } = await import("morgan");
    app.use(morgan("dev"));
  }
  // ROUTES
  app.post("/api/user", makeCallback(postUser));
  app.post("/api/user/auth", makeCallback(signUser));

  app.post("/api/post", makeCallback(addPost));
  app.put("/api/post/:postId", makeCallback(updatePost));
  app.get("/api/post", makeCallback(getPosts));

  app.post("/api/post/:postId/likes", makeCallback(likePost));
  app.delete("/api/post/:postId/likes", makeCallback(unlikePost));

  server = app.listen(PORT, () => {
    console.log(
      `Srever is listening on port ${PORT} in ${process.env.NODE_ENV} mode`
    );
  });
}

export { server };
