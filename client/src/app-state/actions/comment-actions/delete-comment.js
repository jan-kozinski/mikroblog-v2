import useApi from "../../../hooks/useApi";
import { commentsEndpoint } from "../../../constants/api-endpoints";
import { COMM_DELETED, COMM_DELETE_ERROR } from "../types";
import dispatchError from "../dispatch-error";

export const deleteComment = (commentId) => async (dispatch, getState) => {
  try {
    const apiClient = useApi({ dispatch, getState });
    const response = await apiClient.delete(`${commentsEndpoint}/${commentId}`);
    const { payload } = response.data;
    dispatch({ type: COMM_DELETED, commentId, payload });
  } catch (error) {
    dispatchError(error, COMM_DELETE_ERROR, dispatch, { commentId });
  }
};
