import { SEND_MSG, SEND_MSG_ERROR, SOCKET_SENT_MSG } from "../types";
import useApi from "../../../hooks/useApi";
import { conversationsEndpoint } from "../../../constants/api-endpoints";
import dispatchError from "../dispatch-error";

export const sendMessage =
  ({ chatId, text }) =>
  async (dispatch, getState) => {
    try {
      if (!text)
        return dispatch({
          type: SEND_MSG_ERROR,
          payload: { message: "Message can't be empty" },
        });
      const apiClient = useApi({ dispatch, getState });
      const response = await apiClient.post(
        `${conversationsEndpoint}/${chatId}`,
        {
          text,
        }
      );
      const { payload } = response.data;
      dispatch({
        type: SEND_MSG,
        payload: {
          chatId,
          data: payload,
        },
      });
      let { members: recipients } = getState().chat.conversations.find(
        (c) => c.id === chatId
      );
      const loggedUserName = getState().auth.user.name;
      recipients = recipients.filter((m) => m !== loggedUserName);
      dispatch({
        type: SOCKET_SENT_MSG,
        payload: { ...payload, recipients },
      });
    } catch (error) {
      console.error(error);
      dispatchError(error, SEND_MSG_ERROR, dispatch);
    }
  };
