import useApi from "../../../hooks/useApi";
import { commentsEndpoint } from "../../../constants/api-endpoints";
import { COMM_EDITED, EDIT_COMM_ERROR } from "../types";
import dispatchError from "../dispatch-error";

export const editComment =
  ({ content, commentId }) =>
  async (dispatch, getState) => {
    try {
      const apiClient = useApi({ dispatch, getState });
      const response = await apiClient.put(`${commentsEndpoint}/${commentId}`, {
        content,
      });
      const { payload } = response.data;
      dispatch({ type: COMM_EDITED, commentId, payload });
    } catch (error) {
      dispatchError(error, EDIT_COMM_ERROR, dispatch, { commentId });
    }
  };
