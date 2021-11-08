import * as actions from "../actions/socket-actions";
import {
  SOCKET_CONNECT,
  SOCKET_ADDED_POST,
  SOCKET_DISCONNECT,
  POST_ADDED,
} from "../actions/types";
import io from "socket.io-client";

export default function handleSockets() {
  let socket = null;
  return (store) => (next) => (action) => {
    switch (action.type) {
      case SOCKET_CONNECT:
        openSocketConnection();
        break;
      case SOCKET_DISCONNECT:
        if (socket !== null) {
          socket.close();
        }
        socket = null;
        break;
      case POST_ADDED:
        if (socket !== null) {
          console.log("SDKSDFKSFDKFDSKFDK");
          socket.emit("new-post-added");
        }
        return next(action);
      default:
        return next(action);
    }

    function openSocketConnection() {
      if (socket !== null) {
        socket.close();
      }

      // connect to the remote host
      const BASE_URL = process.env.BASE_URL || "http://localhost:5000";
      socket = io(BASE_URL);
      socket.on("connect", () => {
        if (action.payload.username)
          socket.emit("authorised-user-connected", {
            name: action.payload.username,
          });

        socket.on("new-post-added", () => {
          store.dispatch(actions.socketReceivedNewPostInfo());
        });
      });

      socket.on("disconnect", () => {
        if (action.payload.username)
          socket.emit("authorised-user-disconnected", action.payload.username);
      });
    }
  };
}
