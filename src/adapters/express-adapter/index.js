import cookieParser from "cookie-parser";
import express from "express";
import makeCallback from "./make-express-callback.js";
import helmet from "helmet";
import csrf from "csurf";
import {
  postUser,
  signUser,
  sessionUser,
} from "../../controllers/user-controller/index.js";
import {
  addPost,
  updatePost,
  getPosts,
  likePost,
  unlikePost,
} from "../../controllers/post-controller/index.js";
import {
  addComment,
  getComments,
  updateComment,
} from "../../controllers/comment-controller/index.js";

let server;

export default async function start(callback) {
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

  const csrfProtection =
    process.env.NODE_ENV === "test"
      ? (req, res, next) => next()
      : csrf({ cookie: true });
  app.use(csrfProtection);

  // ROUTES
  app.post("/api/user", makeCallback(postUser));
  app.post("/api/user/auth", makeCallback(signUser));
  app.post("/api/user/auth/session", makeCallback(sessionUser));

  app.post("/api/post", makeCallback(addPost));
  app.put("/api/post/:postId", makeCallback(updatePost));
  app.get("/api/post", makeCallback(getPosts));

  app.post("/api/post/:postId/likes", makeCallback(likePost));
  app.delete(
    "/api/post/:postId/likes",

    makeCallback(unlikePost)
  );

  app.post("/api/comment/:originalPostId", makeCallback(addComment));
  app.get("/api/comment/:originalPostId", makeCallback(getComments));
  app.put("/api/comment/:commentId", makeCallback(updateComment));

  // csrf error handler
  app.use(function (err, req, res, next) {
    if (err.code !== "EBADCSRFTOKEN") return next(err);

    // handle CSRF token errors here
    res.status(403);
    res.json({ success: false, error: "Bad csrf token" });
  });

  server = app.listen(PORT, () => {
    console.log(
      `Srever is listening on port ${PORT} in ${process.env.NODE_ENV} mode`
    );
    if (callback) callback();
  });
  return server;
}

export { server };
