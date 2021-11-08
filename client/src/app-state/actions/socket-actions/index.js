import {
  SOCKET_CONNECT,
  SOCKET_ADDED_POST,
  SOCKET_DISCONNECT,
  SOCKET_RECEIVED_NEW_POST_INFO,
} from "../types";

export const connectToSocket = (username) => (dispatch, getState) => {
  dispatch({ type: SOCKET_CONNECT, payload: { username } });
};
export const broadcastThatPostWasAdded = () => (dispatch, getState) => {
  dispatch({ type: SOCKET_ADDED_POST });
};
export const socketReceivedNewPostInfo = () => (dispatch, getState) => {
  dispatch({ type: SOCKET_RECEIVED_NEW_POST_INFO });
};

export const disconnectFromSocket = () => (dispatch, getState) => {
  dispatch({ type: SOCKET_DISCONNECT });
};
