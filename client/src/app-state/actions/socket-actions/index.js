import {
  SOCKET_CONNECT,
  SOCKET_ADDED_POST,
  SOCKET_DISCONNECT,
  SOCKET_RECEIVED_NEW_POST_INFO,
  SOCKET_RECEIVED_MSG,
  SOCKET_SENT_MSG,
} from "../types";

export const connectToSocket = (username) => (dispatch, getState) => {
  dispatch({ type: SOCKET_CONNECT, payload: { username } });
};
export const broadcastThatPostWasAdded = () => (dispatch, getState) => {
  dispatch({ type: SOCKET_ADDED_POST });
};

export const broadcastNewChatMsg = (data) => (dispatch, getState) => {
  dispatch({ type: SOCKET_SENT_MSG, payload: data });
};

export const socketReceivedNewChatMsg = (data) => (dispatch, getState) => {
  dispatch({
    type: SOCKET_RECEIVED_MSG,
    payload: {
      chatId: data.conversationId,
      data,
    },
  });
};

export const socketReceivedNewPostInfo = () => (dispatch, getState) => {
  dispatch({ type: SOCKET_RECEIVED_NEW_POST_INFO });
};

export const disconnectFromSocket = () => (dispatch, getState) => {
  dispatch({ type: SOCKET_DISCONNECT });
};
