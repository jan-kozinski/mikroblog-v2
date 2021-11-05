import cookieParser from "cookie-parser";
import express from "express";
import router from "./routes.js";
import helmet from "helmet";
import csrf from "csurf";
import http from "http";
import cors from "cors";
import { Server as Socketio } from "socket.io";

let server;

export default async function start(callback) {
  const app = express();

  // CONFIG
  const PORT = process.env.PORT || 3000;

  // MIDDLEWARE
  app.use(express.json());
  app.use(cookieParser());
  app.use(helmet());
  app.use(cors());
  if (process.env.NODE_ENV === "development") {
    const { default: morgan } = await import("morgan");
    app.use(morgan("dev"));
  }

  const csrfProtection =
    process.env.NODE_ENV === "test"
      ? (req, res, next) => next()
      : csrf({ cookie: true });
  app.use(csrfProtection);

  // csrf error handler
  app.use(function (err, req, res, next) {
    if (err.code === "EBADCSRFTOKEN") {
      res.status(403);
      res.json({ success: false, error: "Bad csrf token" });
    } else return next(err);
  });

  app.use("/api", router);

  //WEB SOCKETS
  server = http.createServer(app);
  const io = new Socketio(server, {
    cors: { origin: process.env.CLIENT_DOMAIN },
  });

  let connectedSockets = [];

  io.on("connection", (socket) => {
    console.log("new ws connection: ", socket.id);
    socket.on("authorised-user-connected", (payload) => {
      console.log("authorised-user-connected ", payload.name);
      connectedSockets.push({ socket: socket.id, name: payload.name });
    });
    socket.on("new-post-added", () => socket.broadcast.emit("new-post-added"));

    socket.on("disconnect", (reason) => {
      console.log("ws connection closed");
    });
  });

  server = server.listen(PORT, () => {
    console.log(
      `Srever is listening on port ${PORT} in ${process.env.NODE_ENV} mode`
    );
    if (callback) callback();
  });
  return server;
}

export { server };
