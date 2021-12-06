import { SEND_MSG, SEND_MSG_ERROR } from "../types";
import useApi from "../../../hooks/useApi";
import { conversationsEndpoint } from "../../../constants/api-endpoints";
import dispatchError from "../dispatch-error";

export const sendMessage =
  ({ chatId, text }) =>
  async (dispatch, getState) => {
    try {
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
    } catch (error) {
      dispatchError(error, SEND_MSG_ERROR, dispatch);
    }
  };
